import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BookModule } from './../src/book.module';
import { BookService } from '../src/book.service';

describe('BookController (e2e)', () => {
  let app: INestApplication;

  let fakeBookDb = [
    { id: 1, name: 'book1', author: 'author1' },
    { id: 2, name: 'book2', author: 'author2' },
    { id: 3, name: 'book3', author: 'author3' },
  ];

  const bookService = {
    findAll: () => fakeBookDb,
    findOne: (id) => fakeBookDb.find((x) => x.id == id),
    create: (obj) => {
      fakeBookDb.push(obj);
      return obj;
    },
    deleteOne: (id) => {
      fakeBookDb = fakeBookDb.filter((x) => x.id != id);
      return '';
    },
    updateOne: (id, obj) => {
      const book = fakeBookDb.find((x) => x.id == id);
      obj;

      return book;
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [BookModule],
    })
      .overrideProvider(BookService)
      .useValue(bookService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/books (GET)', () => {
    return request(app.getHttpServer())
      .get('/books')
      .expect(200)
      .expect(bookService.findAll());
  });
  it('/books (POST)', () => {
    return request(app.getHttpServer())
      .post('/books')
      .send({ id: 4, name: 'book4', author: 'author4' })
      .expect(201);
  });
  it('/books/{id} (GET)', () => {
    return request(app.getHttpServer()).get('/books/1').expect(200);
  });
  it('/books/{id} (PATCH)', () => {
    return request(app.getHttpServer()).patch('/books/1').expect(200);
  });
  it('/books/{id} (DELETE)', () => {
    return request(app.getHttpServer()).delete('/books/1').expect(200);
    // .then((res) => {
    //   // console.log(res.body);
    // });
  });
});
