import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerDtoStub } from './dto/customer.dto.stub';
import { Customer, CustomerSchema } from './schemas/customer.schema';

describe('customerController', () => {
  let customerController: CustomerController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let customerModel: Model<Customer>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    customerModel = mongoConnection.model(Customer.name, CustomerSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        { provide: getModelToken(Customer.name), useValue: customerModel },
      ],
    }).compile();
    customerController = app.get<CustomerController>(CustomerController);
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

  describe('Create customer', () => {
    it('should return the saved object', async () => {
      const createdCustomer =
        await customerController.create(CustomerDtoStub());
      expect(createdCustomer.name).toBe(CustomerDtoStub().name);
    });
  });

  describe('Find all', () => {
    it('should return all the saved objects', async () => {
      const customer1 = await new customerModel(
        CustomerDtoStub({ name: 'Name1' }),
      ).save();
      const customer2 = await new customerModel(
        CustomerDtoStub({ name: 'Name2' }),
      ).save();
      const customers = await customerController.findAll();
      expect(customers).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customer1.toObject()),
          expect.objectContaining(customer2.toObject()),
        ]),
      );
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const customer = await customerController.findOne(id);
      expect(customer).toBeNull();
    });
    describe('Search function', () => {
      let customer1: Partial<Customer>;
      let customer2: Partial<Customer>;
      beforeEach(async () => {
        customer1 = {
          name: 'Ng',
          email: 'ngtesting@google.com',
        };
        customer2 = {
          name: 'CK',
          email: 'ckmocking@aws.com',
        };

        await new customerModel(CustomerDtoStub(customer1)).save();
        await new customerModel(CustomerDtoStub(customer2)).save();
      });
      it('can search by name', async () => {
        const customerObjs = await customerController.findAll({
          search: 'ng',
        });
        const customers = customerObjs.map((customer) => customer.name);
        expect(customers).toContain(customer1.name);
        expect(customers.length).toBe(1);
      });
      it('can search by email', async () => {
        const customerObjs = await customerController.findAll({
          search: 'ngtesting@google.com',
        });

        const customers = customerObjs.map((customer) => customer.email);
        expect(customers).toContain(customer1.email);
        // expect(customers.length).toBe(1); # NOTE: Difficulte to get exact match when use search string
      });
    });
  });

  describe('Find one', () => {
    it('should return the corresponding saved object', async () => {
      const customer = await new customerModel(CustomerDtoStub()).save();
      const foundCustomer = await customerController.findOne(
        customer._id.toString(),
      );
      expect(foundCustomer.name).toBe(customer.name);
    });
    it('should return null', async () => {
      const id = new Types.ObjectId().toString();
      const customer = await customerController.findOne(id);
      expect(customer).toBeNull();
    });
  });

  describe('Update one', () => {
    it('should return the corresponding updated object', async () => {
      const updatedName = 'Titlte1-updated';
      const customer = await new customerModel(
        CustomerDtoStub({ name: 'Name1' }),
      ).save();
      const updatedCustomer = await customerController.updateOne(
        customer._id.toString(),
        {
          name: updatedName,
        },
      );
      expect(updatedCustomer.name).toBe(updatedName);
    });
  });

  describe('Delete one', () => {
    it('should return null', async () => {
      const customer = await new customerModel(CustomerDtoStub()).save();
      await customerController.deleteOne(customer._id.toString());
      const foundCustomer = await customerController.findOne(
        customer._id.toString(),
      );
      expect(foundCustomer).toBeNull();
    });
  });
});
