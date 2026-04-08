/* @vitest-environment node */

import { createAppServer } from "@/server/bootstrap";
import { taskManager } from "@/server/runtime";

export async function startTestServer() {
  taskManager.clear();

  const appServer = await createAppServer({
    dev: true,
    dir: process.cwd(),
    hostname: "127.0.0.1",
    port: 0,
  });

  const port = await appServer.start();

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    close: () => appServer.close(),
  };
}
