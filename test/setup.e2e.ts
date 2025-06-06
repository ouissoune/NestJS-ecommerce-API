import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let app: INestApplication;
let moduleFixture: TestingModule;
let initPromise: Promise<void> | null = null;

const initializeApp = async (): Promise<void> => {
  moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  await app.init();
};

export const getTestApp = async () => {
  if (!initPromise) {
    initPromise = initializeApp();
  }
  await initPromise;

  return { setupApp: app, moduleFixture };
};
