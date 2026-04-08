import http from "node:http";

import next from "next";
import { Server as SocketIoServer } from "socket.io";

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/lib/shared/tasks";
import { registerTaskSocketHandlers } from "@/server/socket/register-task-socket-handlers";

interface CreateAppServerOptions {
  port?: number;
  hostname?: string;
  dir?: string;
  dev?: boolean;
}

export async function createAppServer({
  port = 3000,
  hostname = "0.0.0.0",
  dir = process.cwd(),
  dev = process.env.NODE_ENV !== "production",
}: CreateAppServerOptions = {}) {
  const app = next({
    dev,
    dir,
    hostname,
    port,
  });

  const handle = app.getRequestHandler();
  await app.prepare();

  const httpServer = http.createServer((request, response) => {
    void handle(request, response);
  });

  const io = new SocketIoServer<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      path: "/socket.io",
      cors: {
        origin: true,
      },
    },
  );

  const disposeSockets = registerTaskSocketHandlers(io);

  return {
    httpServer,
    io,
    async start() {
      await new Promise<void>((resolve) => {
        httpServer.listen(port, hostname, () => resolve());
      });

      const address = httpServer.address();
      if (address && typeof address === "object") {
        return address.port;
      }

      return port;
    },
    async close() {
      disposeSockets();

      await new Promise<void>((resolve, reject) => {
        io.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });

      if (!httpServer.listening) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        httpServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    },
  };
}
