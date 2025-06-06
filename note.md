boilerplate code for e2e tests:

```ts
import { INestApplication } from '@nestjs/common';
import { getTestApp } from '../setup.e2e';

describe('Products E2E Test Suite', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const { setupApp, moduleFixture } = await getTestApp();
    app = setupApp;
    // register your services here if needed
  });
  // Test cases can be added here
  afterAll(async () => {
    await app.close();
  });
});
```
