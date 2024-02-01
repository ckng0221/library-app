import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import request from 'supertest';
import { CustomerController } from '../src/customer.controller';
import {
  CustomerCartService,
  CustomerCredentialService,
  CustomerService,
} from '../src/customer.service';
import {
  Customer,
  CustomerCart,
  CustomerCartSchema,
  CustomerCredential,
  CustomerCredentialSchema,
  CustomerSchema,
} from '../src/schemas/customer.schema';
import { INestApplication } from '@nestjs/common';
import { CustomerDtoStub } from '../src/dto/customer.dto.stub';
import { ReadCustomerDto } from '../src/dto/customer.dto';

describe('Customer (e2e)', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let customerModel: Model<Customer>;
  let customerCredentialModel: Model<CustomerCredential>;
  let customerCartModel: Model<CustomerCart>;
  let testCustomer: ReadCustomerDto;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    customerModel = mongoConnection.model(Customer.name, CustomerSchema);
    customerCredentialModel = mongoConnection.model(
      CustomerCredential.name,
      CustomerCredentialSchema,
    );
    customerCartModel = mongoConnection.model(
      CustomerCart.name,
      CustomerCartSchema,
    );
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        CustomerCredentialService,
        CustomerCartService,
        { provide: getModelToken(Customer.name), useValue: customerModel },
        {
          provide: getModelToken(CustomerCredential.name),
          useValue: customerCredentialModel,
        },
        {
          provide: getModelToken(CustomerCart.name),
          useValue: customerCartModel,
        },
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
      CustomerDtoStub({ name: 'test-customer' }),
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
      .send({ name: 'customer-test', email: 'test2@email.com' })
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
