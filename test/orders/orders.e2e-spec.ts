import { INestApplication } from '@nestjs/common';
import { getTestApp } from '../setup.e2e';
import { UsersService } from 'src/users/users.service';
import { ordersTestAdmins, ordersTestNormals } from '../users/users';
import { OrderStatus, Period, UserType } from 'src/utils/enums';
import { ProductsService } from 'src/products/products.service';
import { CategoriesService } from 'src/categories/categories.service';
import request from 'supertest';
import { OrdersService } from 'src/orders/orders.service';

describe('Orders E2E Test Suite', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let productsService: ProductsService;
  let categoriesService: CategoriesService;
  let accessTokenAdmin0: string;
  let accessTokenNormal0: string;
  let categoryId: number;
  let productId: number;
  let productId1: number;
  let normalUserId0: number;
  let normalUserId1: number;
  beforeAll(async () => {
    const { setupApp, moduleFixture } = await getTestApp();
    app = setupApp;
    // register UsersService services here if needed
    usersService = moduleFixture.get<UsersService>(UsersService);
    //register an admin user
    await usersService.Register({
      email: ordersTestAdmins[0].email,
      password: ordersTestAdmins[0].password,
      username: ordersTestAdmins[0].username,
    });

    const adminUser0 = await usersService.GetUserByEmail(
      ordersTestAdmins[0].email,
    );
    //use usersService to promote it to admin
    await usersService.UpdateUserRoleById(adminUser0.id, UserType.ADMIN);
    //login with the admin user
    await usersService
      .Login({
        email: ordersTestAdmins[0].email,
        password: ordersTestAdmins[0].password,
      })
      // and get the access token
      .then((res) => {
        accessTokenAdmin0 = res.accessToken;
      });

    //register a normal user
    await usersService
      .Register({
        email: ordersTestNormals[0].email,
        password: ordersTestNormals[0].password,
        username: ordersTestNormals[0].username,
      })
      // and get the access token
      .then((res) => {
        accessTokenNormal0 = res.accessToken;
      });
    // get the user id of the normal user0
    const normalUser0 = await usersService.GetUserByEmail(
      ordersTestNormals[0].email,
    );
    normalUserId0 = normalUser0.id;
    // register normal user1
    await usersService.Register({
      email: ordersTestNormals[1].email,
      password: ordersTestNormals[1].password,
      username: ordersTestNormals[1].username,
    });
    // get the user id of the normal user1
    const normalUser1 = await usersService.GetUserByEmail(
      ordersTestNormals[1].email,
    );
    normalUserId1 = normalUser1.id;

    //register categories service
    categoriesService = moduleFixture.get<CategoriesService>(CategoriesService);

    // create a category to use in product creation
    await categoriesService
      .createCategory({
        name: 'Test Category',
      })
      .then((category) => {
        categoryId = category.id;
      });

    // register products service
    productsService = moduleFixture.get<ProductsService>(ProductsService);
    // create some products
    await productsService
      .addProduct({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        categoryId: categoryId,
        featured: false,
        quantity: 10,
      })
      .then((product) => {
        productId = product.id;
      });
    await productsService
      .addProduct({
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 200,
        categoryId: categoryId,
        featured: true,
        quantity: 20,
      })
      .then((product) => {
        productId1 = product.id;
      });

    //register orders service
    const ordersService = moduleFixture.get<OrdersService>(OrdersService);
    // create an order by a normal user0
    await ordersService.createOrder(
      {
        productsInOrder: [
          {
            productId: productId,
            quantity: 1,
          },
          {
            productId: productId1,
            quantity: 3,
          },
        ],
      },
      normalUserId0,
    );
    // create an order by a normal user1
    await ordersService.createOrder(
      {
        productsInOrder: [
          {
            productId: productId,
            quantity: 2,
          },
          {
            productId: productId1,
            quantity: 5,
          },
        ],
      },
      normalUserId1,
    );
  });

  it('should create an order by a normal user', async () => {
    const createOrderResponse = await request(app.getHttpServer())
      .post('/api/orders')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .send({
        productsInOrder: [
          {
            productId: productId,
            quantity: 2,
          },
          {
            productId: productId1,
            quantity: 7,
          },
        ],
      })
      .expect(201);
    expect(createOrderResponse.body).toHaveProperty('id');
    expect(createOrderResponse.body).toHaveProperty('totalPrice');
    // Test cases can be added here
  });

  it('should get filtered orders by period and status of a normal user', async () => {
    const getOrdersResponse = await request(app.getHttpServer())
      .get('/api/orders')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .query({
        period: Period.TODAY,
        status: OrderStatus.PENDING,
      })
      .expect(200);
    expect(getOrdersResponse.body).toBeInstanceOf(Array);
    expect(getOrdersResponse.body.length).toEqual(2);
  });

  it('should get all orders by an admin user', async () => {
    const getOrdersResponse = await request(app.getHttpServer())
      .get('/api/orders')
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .query({
        period: Period.TODAY,
        status: OrderStatus.PENDING,
      })
      .expect(200);
    expect(getOrdersResponse.body).toBeInstanceOf(Array);
    expect(getOrdersResponse.body.length).toBeGreaterThanOrEqual(2); // At least 2 orders created
  });
  afterAll(async () => {
    await app.close();
  });
});
