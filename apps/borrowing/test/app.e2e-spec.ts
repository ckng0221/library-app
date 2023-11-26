import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import * as request from 'supertest';
import { BorrowingController } from '../src/borrowing.controller';
import { BorrowingService } from '../src/borrowing.service';
import { BorrowingDtoStub } from '../src/dto/borrowing.dto.stub';
import { Borrowing, BorrowingSchema } from '../src/schemas/borrowing.schema';

describe('Borrowing (e2e)', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let borrowingModel: Model<Borrowing>;
  let testBorrowing: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    borrowingModel = mongoConnection.model(Borrowing.name, BorrowingSchema);
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BorrowingController],
      providers: [
        BorrowingService,
        { provide: getModelToken(Borrowing.name), useValue: borrowingModel },
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
    testBorrowing = await new borrowingModel(
      BorrowingDtoStub({
        customer_id: new Types.ObjectId(),
        customer_name: 'test-borrowing',
        books: [{ id: new Types.ObjectId(), name: 'Test book' }],
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

  // it('/borrowings (GET)', () => {
  //   return request(app.getHttpServer()).get('/borrowings').expect(200);
  // });

  it('/borrowings (POST)', () => {
    return request(app.getHttpServer())
      .post('/borrowings')
      .send({
        customer_id: new Types.ObjectId(),
        customer_name: 'test-customer',
        books: [{ id: new Types.ObjectId(), name: 'Test book' }],
      })
      .expect(201);
  });

  it('/borrowings/{id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/borrowings/${testBorrowing._id}`)
      .expect(200);
  });

  it('/borrowings/{id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/borrowings/${testBorrowing._id}`)
      .send({ title: 'updated-borrowing' })
      .expect(200);
  });

  it('/borrowings/{id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/borrowings/${testBorrowing._id}`)
      .expect(200);
  });
});
