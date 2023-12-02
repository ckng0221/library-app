import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { BorrowingController } from './borrowing.controller';
import { BorrowingService } from './borrowing.service';
import { BorrowingDtoStub } from './dto/borrowing.dto.stub';
import { Borrowing, BorrowingSchema } from './schemas/borrowing.schema';

describe('borrowingController', () => {
  let borrowingController: BorrowingController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let borrowingModel: Model<Borrowing>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    borrowingModel = mongoConnection.model(Borrowing.name, BorrowingSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [
        BorrowingService,
        { provide: getModelToken(Borrowing.name), useValue: borrowingModel },
        { provide: 'PAYMENT', useValue: mock<AmqpConnection>() },
      ],
    }).compile();
    borrowingController = app.get<BorrowingController>(BorrowingController);
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

  describe('Create borrowing', () => {
    it('should return all the saved objects', async () => {
      const borrowing1 = await new borrowingModel(
        BorrowingDtoStub({ customer_name: 'Name1' }),
      ).save();
      const borrowing2 = await new borrowingModel(
        BorrowingDtoStub({ customer_name: 'Name2' }),
      ).save();
      const borrowings = await borrowingController.findAll();
      expect(borrowings).toEqual(
        expect.arrayContaining([
          expect.objectContaining(borrowing1.toObject()),
          expect.objectContaining(borrowing2.toObject()),
        ]),
      );
    });

    it('should return the saved object', async () => {
      const createdBorrowing =
        await borrowingController.create(BorrowingDtoStub());
      expect(createdBorrowing.customer_name).toBe(
        BorrowingDtoStub().customer_name,
      );
    });
  });

  describe('Find one', () => {
    it('should return the corresponding saved object', async () => {
      const borrowing = await new borrowingModel(BorrowingDtoStub()).save();
      const foundBorrowing = await borrowingController.findOne(
        borrowing._id.toString(),
      );
      expect(foundBorrowing.customer_name).toBe(borrowing.customer_name);
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const borrowing = await borrowingController.findOne(id);
      expect(borrowing).toBeNull();
    });
  });

  describe('Update one', () => {
    it('should return the corresponding updated object', async () => {
      const updatedName = 'Titlte1-updated';
      const borrowing = await new borrowingModel(
        BorrowingDtoStub({ customer_name: 'Name1' }),
      ).save();
      const updatedBorrowing = await borrowingController.updateOne(
        borrowing._id.toString(),
        {
          customer_name: updatedName,
        },
      );
      expect(updatedBorrowing.customer_name).toBe(updatedName);
    });
  });

  describe('Delete one', () => {
    it('should return null', async () => {
      const borrowing = await new borrowingModel(BorrowingDtoStub()).save();
      await borrowingController.deleteOne(borrowing._id.toString());
      const foundBorrowing = await borrowingController.findOne(
        borrowing._id.toString(),
      );
      expect(foundBorrowing).toBeNull();
    });
  });
});
