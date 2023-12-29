import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PaymentDtoStub } from './dto/payment.dto.stub';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { EventGateway } from './events.gateway';

describe('paymentController', () => {
  let paymentController: NotificationController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let paymentModel: Model<Payment>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    paymentModel = mongoConnection.model(Payment.name, PaymentSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        NotificationService,
        { provide: getModelToken(Payment.name), useValue: paymentModel },
        { provide: 'PAYMENT', useValue: mock<AmqpConnection>() },
        EventGateway,
      ],
    }).compile();
    paymentController = app.get<NotificationController>(NotificationController);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('Create payment', () => {
    it('should return all the saved objects', async () => {
      const payment1 = await new paymentModel(
        PaymentDtoStub({ borrowing_id: new Types.ObjectId() }),
      ).save();
      const payment2 = await new paymentModel(
        PaymentDtoStub({ borrowing_id: new Types.ObjectId() }),
      ).save();
      const payments = await paymentController.findAll();
      expect(payments).toEqual(
        expect.arrayContaining([
          expect.objectContaining(payment1.toObject()),
          expect.objectContaining(payment2.toObject()),
        ]),
      );
    });

    it('should return the saved object', async () => {
      const paymentDtoStub = PaymentDtoStub({
        borrowing_id: new Types.ObjectId('656215a752ad6138536f74a4'),
      });
      const createdPayment = await paymentController.create(paymentDtoStub);
      expect(createdPayment.borrowing_id).toBe(paymentDtoStub.borrowing_id);
    });
  });

  describe('Find one', () => {
    it('should return the corresponding saved object', async () => {
      const payment = await new paymentModel({
        borrowing_id: new Types.ObjectId('656215a752ad6138536f74a4'),
      }).save();
      const foundPayment = await paymentController.findOne(
        payment._id.toString(),
      );
      console.log(foundPayment._id);

      expect(foundPayment._id.toString()).toBe(payment._id.toString());
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const payment = await paymentController.findOne(id);
      expect(payment).toBeNull();
    });
  });

  describe('Delete one', () => {
    it('should return null', async () => {
      const payment = await new paymentModel({
        borrowing_id: new Types.ObjectId('656215a752ad6138536f74a4'),
      }).save();
      await paymentController.deleteOne(payment._id.toString());
      const foundPayment = await paymentController.findOne(
        payment._id.toString(),
      );
      expect(foundPayment).toBeNull();
    });
  });
});
