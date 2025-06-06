import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersService } from 'src/users/users.service';
import { productsTestAdmins, productsTestNormals } from '../users/users';
import { UserType } from 'src/utils/enums';
import { CategoriesService } from 'src/categories/categories.service';
import { ProductsService } from 'src/products/products.service';
import path from 'path';
import { getTestApp } from '../setup.e2e';

describe('Products E2E Test Suite', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let accessTokenAdmin0: string;
  let accessTokenNormal0: string;
  let categoriesService: CategoriesService;
  let productsService: ProductsService;
  let categoryId: number;
  let productId: number;
  let productId1: number;
  beforeAll(async () => {
    const { setupApp, moduleFixture } = await getTestApp();
    app = setupApp;
    usersService = moduleFixture.get<UsersService>(UsersService);
    // register an admin user
    await usersService.Register({
      email: productsTestAdmins[0].email,
      password: productsTestAdmins[0].password,
      username: productsTestAdmins[0].username,
    });

    //use usersService to promote it to admin
    const user = await usersService.GetUserByEmail(productsTestAdmins[0].email);
    await usersService.UpdateUserRoleById(user.id, UserType.ADMIN);
    await usersService
      .Login({
        email: productsTestAdmins[0].email,
        password: productsTestAdmins[0].password,
      })
      // and get the access token
      .then((res) => {
        accessTokenAdmin0 = res.accessToken;
      });

    //register a normal user
    await usersService
      .Register({
        email: productsTestNormals[0].email,
        password: productsTestNormals[0].password,
        username: productsTestNormals[0].username,
      })
      // and get the access token
      .then((res) => {
        accessTokenNormal0 = res.accessToken;
      });
    //category Service
    categoriesService = moduleFixture.get<CategoriesService>(CategoriesService);
    // create a category to use in product creation
    const category = await categoriesService.createCategory({
      name: 'Test Category',
    });
    categoryId = category.id;

    //create some test products
    productsService = moduleFixture.get<ProductsService>(ProductsService);
    const product = await productsService.addProduct({
      name: 'Test Product 1',
      description: 'This is a test product 1',
      price: 100,
      quantity: 10,
      featured: true,
      categoryId,
    });
    productId = product.id;

    const product1 = await productsService.addProduct({
      name: 'Test Product 2',
      description: 'This is a test product 2',
      price: 200,
      quantity: 20,
      featured: false,
      categoryId,
    });
    productId1 = product1.id;
  });

  it('should create a product as admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        quantity: 10,
        featured: true,
        categoryId,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
  });

  it('should not allow normal user to create a product', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .send({
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        quantity: 10,
        featured: true,
        categoryId,
      })
      .expect(403);
  });

  it('should allow admin to get a product by ID', async () => {
    const getProductByIdResponse = await request(app.getHttpServer())
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .expect(200);
    expect(getProductByIdResponse.body).toHaveProperty('id', productId);
  });

  it('should allow normal user to get a product by ID', async () => {
    const getProductByIdResponse = await request(app.getHttpServer())
      .get(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .expect(200);
    expect(getProductByIdResponse.body).toHaveProperty('id', productId);
  });

  it('should allow admin to update a product by id', async () => {
    const updateResponse = await request(app.getHttpServer())
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .send({
        name: 'Updated Test Product',
        description: 'This is an updated test product',
        price: 150,
        quantity: 5,
      })
      .expect(200);

    expect(updateResponse.body).toHaveProperty('id');
    expect(updateResponse.body.name).toBe('Updated Test Product');
  });

  it('should not allow normal user to update a product', async () => {
    await request(app.getHttpServer())
      .patch(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .send({
        name: 'Updated Test Product',
        description: 'This is an updated test product',
        price: 150,
        quantity: 5,
      })
      .expect(403);
  });

  it('should allow an admin to assign an image to a product', async () => {
    const imageResponse = await request(app.getHttpServer())
      .put(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .attach('image', path.join(__dirname, 'images', 'GAbscences.jpg'))
      .expect(200);

    expect(imageResponse.body).toHaveProperty('id');
    expect(imageResponse.body.id).toBe(productId);
  });

  it('shouldn"t allow an admin to assign an image to a product with invalid file type', async () => {
    await request(app.getHttpServer())
      .put(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .set('Connection', 'keep-alive') // Keep-alive to avoid timeout issues  very important!!!!
      .attach('image', path.join(__dirname, 'images', 'file.txt'))
      .expect(400);
  });

  it('should not allow a normal user to assign an image to a product', async () => {
    await request(app.getHttpServer())
      .put(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .set('Connection', 'keep-alive') // Keep-alive to avoid timeout issues  very important!!!!
      .attach('image', path.join(__dirname, 'images', 'GAbscences.jpg'))
      .expect(403);
  });

  it('should allow an admin to delete a product by id', async () => {
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/products/${productId1}`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty('message');
    expect(deleteResponse.body.message).toBe(
      `Product with id ${productId1} deleted successfully`,
    );
  });

  it('should not allow a normal user to delete a product', async () => {
    await request(app.getHttpServer())
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .expect(403);
  });

  it('should allow an admin to delete a product image', async () => {
    const deleteImageResponse = await request(app.getHttpServer())
      .delete(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .expect(200);

    expect(deleteImageResponse.body).toHaveProperty('image');
    expect(deleteImageResponse.body.image).toBeFalsy();
  });

  it('should not allow a normal user to delete a product image', async () => {
    await request(app.getHttpServer())
      .delete(`/api/products/${productId}/images`)
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .expect(403);
  });

  it('should allow a user to get featured products with limit', async () => {
    const getAllProductsResponse = await request(app.getHttpServer())
      .get('/api/products')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .query({ limit: 10, featured: true })
      .expect(200);

    expect(getAllProductsResponse.body).toBeInstanceOf(Array);
    expect(getAllProductsResponse.body.length).toBeGreaterThan(0);
  });

  it('should allow a user to get products with pagination', async () => {
    const getAllProductsResponse = await request(app.getHttpServer())
      .get('/api/products')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .query({ size: 10, page: 1, categoryId: 0, minPrice: 0, maxPrice: 0 })
      .expect(200);

    expect(getAllProductsResponse.body).toBeInstanceOf(Array);
    expect(getAllProductsResponse.body.length).toBeGreaterThan(0);
  });

  it('should allow a user to get products with filters', async () => {
    const getAllProductsResponse = await request(app.getHttpServer())
      .get('/api/products')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .query({ minPrice: 50, maxPrice: 150, categoryId, size: 10, page: 1 })
      .expect(200);

    expect(getAllProductsResponse.body).toBeInstanceOf(Array);
    expect(getAllProductsResponse.body.length).toBeGreaterThan(0);
  });

  it('should allow a user to get products with featured filter', async () => {
    const getAllProductsResponse = await request(app.getHttpServer())
      .get('/api/products')
      .set('Authorization', `Bearer ${accessTokenNormal0}`)
      .query({ featured: true, limit: 10 })
      .expect(200);

    expect(getAllProductsResponse.body).toBeInstanceOf(Array);
    expect(getAllProductsResponse.body.length).toBeGreaterThan(0);
  });
  afterAll(async () => {
    await app.close();
  });
});
