import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import * as request from 'supertest';
import { BookController } from '../src/book.controller';
import { BookService } from '../src/book.service';
import { BookDtoStub } from '../src/dto/book.dto.stub';
import { Book, BookSchema } from '../src/schemas/book.schema';
import { ReadBookDto } from '../src/dto/book.dto';

describe('Book (e2e)', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let bookModel: Model<Book>;
  let testBook: ReadBookDto;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    bookModel = mongoConnection.model(Book.name, BookSchema);
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        { provide: getModelToken(Book.name), useValue: bookModel },
        { provide: 'NOTIFICATION', useValue: mock<AmqpConnection>() },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    testBook = await new bookModel(BookDtoStub({ title: 'test-book' })).save();
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  beforeEach(async () => {
    testBook = await new bookModel(BookDtoStub({ title: 'test-book' })).save();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer()).get('/books').expect(200);
  });
  it('/books (POST)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({ title: 'book4', author: 'author4' })
      .expect(201);
  });
  it('/books/{id} (GET)', () => {
    return request(app.getHttpServer())
      .get(`/books/${testBook._id}`)
      .expect(200);
  });
  it('/books/{id} (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/books/${testBook._id}`)
      .send({ title: 'updated-book' })
      .expect(200);
  });
  it('/books/{id} (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/books/${testBook._id}`)
      .expect(200);
  });
});
