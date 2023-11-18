import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CustomerModule } from './../src/customer.module';
import { CustomerService } from '../src/customer.service';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  let fakeCustomerDb = [
    { id: 1, name: 'customer1', author: 'author1' },
    { id: 2, name: 'customer2', author: 'author2' },
    { id: 3, name: 'customer3', author: 'author3' },
  ];

  const customerService = {
    findAll: () => fakeCustomerDb,
    findOne: (id) => fakeCustomerDb.find((x) => x.id == id),
    create: (obj) => {
      fakeCustomerDb.push(obj);
      return obj;
    },
    deleteOne: (id) => {
      fakeCustomerDb = fakeCustomerDb.filter((x) => x.id != id);
      return '';
    },
    updateOne: (id, obj) => {
      const customer = fakeCustomerDb.find((x) => x.id == id);
      obj;

      return customer;
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomerModule],
    })
      .overrideProvider(CustomerService)
      .useValue(customerService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/customers (GET)', () => {
    return request(app.getHttpServer())
      .get('/customers')
      .expect(200)
      .expect(customerService.findAll());
  });
  it('/customers (POST)', () => {
    return request(app.getHttpServer())
      .post('/customers')
      .send({ id: 4, name: 'customer4', author: 'author4' })
      .expect(201);
  });
  it('/customers/{id} (GET)', () => {
    return request(app.getHttpServer()).get('/customers/1').expect(200);
  });
  it('/customers/{id} (PATCH)', () => {
    return request(app.getHttpServer()).patch('/customers/1').expect(200);
  });
  it('/customers/{id} (DELETE)', () => {
    return request(app.getHttpServer()).delete('/customers/1').expect(200);
    // .then((res) => {
    //   console.log(res.body);
    // });
  });
});
