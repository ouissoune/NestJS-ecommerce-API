import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UsersService } from 'src/users/users.service';
import { UserType } from 'src/utils/enums';
import { usersTestAdmins, usersTestNormals } from './users';
import { getTestApp } from '../setup.e2e';

describe('Users E2E Test Suite', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let normalUserId0: number;
  let accessTokenUsersNormal0: string;
  let accessTokenUsersNormal1: string;
  let accessTokenAdmin0: string;
  beforeAll(async () => {
    const { setupApp, moduleFixture } = await getTestApp();
    app = setupApp;
    usersService = moduleFixture.get<UsersService>(UsersService);
    // create a normal_user1 => will be promoted to admin later

    await usersService
      .Register({
        email: usersTestNormals[0].email,
        password: usersTestNormals[0].password,
        username: usersTestNormals[0].username,
      })
      .then((res) => (accessTokenUsersNormal0 = res.accessToken));

    const user = await usersService.GetUserByEmail(usersTestNormals[0].email);
    normalUserId0 = user.id;

    // create a normal user => will try to promote another user later
    await usersService
      .Register({
        email: usersTestNormals[1].email,
        password: usersTestNormals[1].password,
        username: usersTestNormals[1].username,
      })
      .then((res) => {
        accessTokenUsersNormal1 = res.accessToken;
      });

    // create an admin user

    await usersService.Register({
      email: usersTestAdmins[0].email,
      password: usersTestAdmins[0].password,
      username: usersTestAdmins[0].username,
    });
    const AdminUser = await usersService.GetUserByEmail(
      usersTestAdmins[0].email,
    );
    await usersService.UpdateUserRoleById(AdminUser.id, UserType.ADMIN);
    //login with the admin user
    await usersService
      .Login({
        email: usersTestAdmins[0].email,
        password: usersTestAdmins[0].password,
      })
      .then((res) => {
        expect(res).toHaveProperty('accessToken');
        expect(res.accessToken).toBeDefined();
        expect(res.accessToken).toBeTruthy();
        accessTokenAdmin0 = res.accessToken;
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a user and get an accessToken in the response', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        email: usersTestNormals[2].email,
        password: usersTestNormals[2].password,
        username: usersTestNormals[2].username,
      })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
  });

  it('should login the registered user and get an accessToken in the response', async () => {
    // Then, login the user
    const loginResponse = await request(app.getHttpServer())
      .post('/api/users/auth/login')
      .send({
        email: usersTestNormals[0].email,
        password: usersTestNormals[0].password,
      })
      .expect(201);
    expect(loginResponse.body).toHaveProperty('accessToken');
    expect(loginResponse.body.accessToken).toBeDefined();
    expect(loginResponse.body.accessToken).toBeTruthy();
  });

  it('should promote a user to admin by an admin user', async () => {
    // Now, promote the normalUser to admin
    const promotionRes = await request(app.getHttpServer())
      .patch(`/api/users/${normalUserId0}`)
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .send({
        role: UserType.ADMIN,
      })
      .expect(200);
    expect(promotionRes.body).toHaveProperty('message');
    expect(promotionRes.body.message).toBe(
      `user with id ${normalUserId0} updated to role ${UserType.ADMIN}`,
    );
  });
  it('should throw an error when a normal_user tries to promote another user', async () => {
    // Now, try to promote another user
    const promotionRes = await request(app.getHttpServer())
      .patch(`/api/users/${normalUserId0}`)
      .set('Authorization', `Bearer ${accessTokenUsersNormal1}`)
      .send({
        role: UserType.ADMIN,
      })
      .expect(403);
    expect(promotionRes.body).toHaveProperty('message');
    expect(promotionRes.body.message).toBe('Access denied, insufficient roles');
  });

  it('should get the current user details', async () => {
    const userResponse = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessTokenUsersNormal0}`)
      .expect(200);

    expect(userResponse.body).toHaveProperty('id');
    expect(userResponse.body.email).toBe(usersTestNormals[0].email);
  });

  it('should update the current user details', async () => {
    const updateResponse = await request(app.getHttpServer())
      .patch('/api/users')
      .set('Authorization', `Bearer ${accessTokenUsersNormal0}`)
      .send({
        username: 'UpdatedUsername',
      })
      .expect(200);

    expect(updateResponse.body).toHaveProperty('id');
    expect(updateResponse.body.username).toBe('UpdatedUsername');
  });

  it('should get all users when accessed by an admin', async () => {
    const usersResponse = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${accessTokenAdmin0}`)
      .expect(200);

    expect(usersResponse.body).toBeInstanceOf(Array);
    expect(usersResponse.body.length).toBeGreaterThan(0);
  });

  it('should not allow a normal user to get all users', async () => {
    const usersResponse = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${accessTokenUsersNormal0}`)
      .expect(403);

    expect(usersResponse.body).toHaveProperty('message');
    expect(usersResponse.body.message).toBe(
      'Access denied, insufficient roles',
    );
  });
});
