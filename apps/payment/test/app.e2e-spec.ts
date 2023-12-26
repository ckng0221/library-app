import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import * as request from 'supertest';
import { PaymentDtoStub } from '../src/dto/payment.dto.stub';
import { PaymentController } from '../src/payment.controller';
import { PaymentService } from '../src/payment.service';
import { Payment, PaymentSchema } from '../src/schemas/payment.schema';
import { EventGateway } from '../src/events.gateway';

describe('Payment (e2e)', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let paymentModel: Model<Payment>;
  let testPayment: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    paymentModel = mongoConnection.model(Payment.name, PaymentSchema);
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        { provide: getModelToken(Payment.name), useValue: paymentModel },
        { provide: 'PAYMENT', useValue: mock<AmqpConnection>() },
        EventGateway,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    testPayment = await new paymentModel(
      PaymentDtoStub({
        borrowing_id: new Types.ObjectId(),
      }),
    ).save();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('/payments (POST)', () => {
    return request(app.getHttpServer())
      .post('/payments')
      .send({
        borrowing_id: new Types.ObjectId(),
      })
      .expect(201);
  });

  it('/payments/{id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/payments/${testPayment._id}`)
      .expect(200);
  });

  it('/payments/{id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/payments/${testPayment._id}`)
      .expect(200);
  });
});
