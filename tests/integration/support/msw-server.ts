/* @vitest-environment node */

import { setupServer } from "msw/node";

export const integrationMswServer = setupServer();

export function setupIntegrationMsw() {
  beforeAll(() => {
    integrationMswServer.listen({
      onUnhandledRequest: "error",
    });
  });

  afterEach(() => {
    integrationMswServer.resetHandlers();
  });

  afterAll(() => {
    integrationMswServer.close();
  });
}
