import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookDtoStub } from './dto/book.dto.stub';
import { Book, BookSchema } from './schemas/book.schema';

describe('bookController', () => {
  let bookController: BookController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let bookModel: Model<Book>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    bookModel = mongoConnection.model(Book.name, BookSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        BookService,
        { provide: getModelToken(Book.name), useValue: bookModel },
        { provide: 'NOTIFICATION', useValue: mock<AmqpConnection>() },
      ],
    }).compile();
    bookController = app.get<BookController>(BookController);
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

  describe('Create book', () => {
    it('should return the saved object', async () => {
      const createdBook = await bookController.create(BookDtoStub());
      expect(createdBook.title).toBe(BookDtoStub().title);
    });
  });

  describe('Find all', () => {
    it('should return all the saved objects', async () => {
      const book1 = await new bookModel(
        BookDtoStub({ title: 'Title1' }),
      ).save();
      const book2 = await new bookModel(
        BookDtoStub({ title: 'Title2' }),
      ).save();
      const books = await bookController.findAll();

      expect(books).toEqual(
        expect.arrayContaining([
          expect.objectContaining(book1.toObject()),
          expect.objectContaining(book2.toObject()),
        ]),
      );
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const book = await bookController.findOne(id);
      expect(book).toBeNull();
    });

    describe('Search function', () => {
      let book1: Partial<Book>;
      let book2: Partial<Book>;
      beforeEach(async () => {
        book1 = {
          title: 'Article',
          author: 'Ng',
          isbn: '222-3-16-148410-0',
        };
        book2 = {
          title: 'Story',
          author: 'CK',
          isbn: '978-3-16-222222-0',
        };

        await new bookModel(BookDtoStub(book1)).save();
        await new bookModel(BookDtoStub(book2)).save();
      });
      it('can search by title', async () => {
        const bookObjs = await bookController.findAll({ search: 'article' });
        const books = bookObjs.map((book) => book.title);
        expect(books).toContain(book1.title);
        expect(books.length).toBe(1);
      });
      it('can search by author', async () => {
        const bookObjs = await bookController.findAll({ search: 'CK' });

        const books = bookObjs.map((book) => book.author);
        expect(books).toContain(book2.author);
        expect(books.length).toBe(1);
      });
      it('can search by isbn', async () => {
        const bookObjs = await bookController.findAll({
          search: '978-3-16-148410-0',
        });
        const books = bookObjs.map((book) => book.isbn);
        expect(books).toContain(book1.isbn);
      });
    });
  });

  describe('Find one', () => {
    it('should return the corresponding saved object', async () => {
      const book = await new bookModel(BookDtoStub()).save();
      const foundBook = await bookController.findOne(book._id.toString());
      expect(foundBook.title).toBe(book.title);
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const book = await bookController.findOne(id);
      expect(book).toBeNull();
    });
  });

  describe('Update one', () => {
    it('should return the corresponding updated object', async () => {
      const updatedTitle = 'Titlte1-updated';
      const book = await new bookModel(BookDtoStub({ title: 'Title1' })).save();
      const updatedBook = await bookController.updateOne(book._id.toString(), {
        title: updatedTitle,
      });
      expect(updatedBook.title).toBe(updatedTitle);
    });
  });

  describe('Delete one', () => {
    it('should return null', async () => {
      const book = await new bookModel(BookDtoStub()).save();
      await bookController.deleteOne(book._id.toString());
      const foundBook = await bookController.findOne(book._id.toString());
      expect(foundBook).toBeNull();
    });
  });
});
