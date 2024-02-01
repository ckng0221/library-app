import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, Types, connect } from 'mongoose';
import {
  CustomerCartController,
  CustomerController,
} from './customer.controller';
import {
  CustomerCartService,
  CustomerCredentialService,
  CustomerService,
} from './customer.service';
import { CustomerCartDtoStub, CustomerDtoStub } from './dto/customer.dto.stub';
import {
  Customer,
  CustomerCart,
  CustomerCartSchema,
  CustomerCredential,
  CustomerCredentialSchema,
  CustomerSchema,
} from './schemas/customer.schema';

describe('customerController', () => {
  let customerController: CustomerController;
  let customerCartController: CustomerCartController;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let customerModel: Model<Customer>;
  let customerCredentialModel: Model<CustomerCredential>;
  let customerCartModel: Model<CustomerCart>;

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
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController, CustomerCartController],
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
    customerController = app.get<CustomerController>(CustomerController);
    customerCartController = app.get<CustomerCartController>(
      CustomerCartController,
    );
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

  describe('Customer Controller', () => {
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

    describe('Find all carts by customer', () => {
      it('should return empty', async () => {
        const customer = await new customerModel(CustomerDtoStub()).save();

        const carts = await customerController.findOneCarts(
          customer._id.toString(),
        );

        expect(carts.length).toBe(0);
      });

      it('should return carts based on customer', async () => {
        const customer = await new customerModel(CustomerDtoStub()).save();
        const carts = await new customerCartModel(
          CustomerCartDtoStub({ customer: customer._id.toString() as any }),
        ).save();

        console.log(carts);
        console.log(customer._id.toString());

        const foundCarts = await customerController.findOneCarts(
          customer?._id.toString(),
        );

        expect(foundCarts.length).toBe(1);
      });
    });
  });

  describe('Customer Cart Controller', () => {
    describe('Create customer Cart', () => {
      it('should return the saved object', async () => {
        const customer_id = new Types.ObjectId();
        const book_id = new Types.ObjectId();

        const customerCart: any = CustomerCartDtoStub({
          customer: customer_id,
          book_id,
        });

        const createdCustomerCart = await customerCartController.create(
          customerCart,
          {
            user: { sub: customer_id },
          } as any,
        );
        expect(createdCustomerCart._id.toString()).toBe(
          customerCart._id.toString(),
        );
      });
    });

    describe('Find one', () => {
      it('should return the corresponding saved object', async () => {
        const customer_id = new Types.ObjectId();
        const book_id = new Types.ObjectId();

        const customerCart = await new customerCartModel(
          CustomerCartDtoStub({ customer: customer_id, book_id }),
        ).save();
        const foundCustomerCart = await customerCartController.findOne(
          customerCart._id.toString(),
        );
        expect(foundCustomerCart._id.toString()).toBe(
          customerCart._id.toString(),
        );
      });
      it('should return null', async () => {
        const id = new Types.ObjectId().toString();
        const customerCart = await customerCartController.findOne(id);
        expect(customerCart).toBeNull();
      });
    });

    describe('Update one', () => {
      it('should return the corresponding updated object', async () => {
        const updatedQuantity = 2;
        const customerCart = await new customerCartModel(
          CustomerCartDtoStub({ quantity: 1 }),
        ).save();
        const updatedCustomer = await customerCartController.updateOne(
          customerCart._id.toString(),
          {
            quantity: 2,
          },
        );
        expect(updatedCustomer.quantity).toBe(updatedQuantity);
      });
    });

    describe('Delete one', () => {
      it('should return null', async () => {
        const customer_id = new Types.ObjectId();

        const customerCart = await new customerCartModel(
          CustomerCartDtoStub({ customer: customer_id.toString() as any }),
        ).save();

        await customerCartController.deleteOne(customerCart._id.toString(), {
          user: { sub: customer_id.toString() },
        } as any);
        const foundCustomerCart = await customerCartController.findOne(
          customerCart._id.toString(),
        );

        expect(foundCustomerCart).toBeNull();
      });
    });
  });
});
