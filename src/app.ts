import AppServer from "./app/server";

export const server = new AppServer();
await server.start();
