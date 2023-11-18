import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import * as request from 'supertest';
import { CustomerController } from '../src/customer.controller';
import { CustomerService } from '../src/customer.service';
import { Customer, CustomerSchema } from '../src/schemas/customer.schema';
import { INestApplication } from '@nestjs/common';
import { CustomerDtoStub } from '../src/dto/customer.dto.stub';

describe('Customer (e2e)', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let customerModel: Model<Customer>;
  let testCustomer: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    customerModel = mongoConnection.model(Customer.name, CustomerSchema);
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        { provide: getModelToken(Customer.name), useValue: customerModel },
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
    testCustomer = await new customerModel(
      CustomerDtoStub('test-customer'),
    ).save();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('/customers (GET)', () => {
    return request(app.getHttpServer()).get('/customers').expect(200);
  });
  it('/customers (POST)', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send({ name: 'customer-test', email: 'test@email.com' })
      .expect(201);
  });
  it('/customers/{id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/customers/${testCustomer._id}`)
      .expect(200);
  });
  it('/customers/{id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/customers/${testCustomer._id}`)
      .send({ title: 'updated-customer' })
      .expect(200);
  });
  it('/customers/{id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/customers/${testCustomer._id}`)
      .expect(200);
  });
});
