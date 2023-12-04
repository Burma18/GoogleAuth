import { buildServer } from "./app";

const server = buildServer();

const start = async () => {
  try {
    const address = await server.listen({ port: 4000, host: "0.0.0.0" });
    console.log("server listening at :", address);
  } catch (error) {
    const err = error as Error;
    console.log("Error running server :", err.message);
    process.exit(1);
  }
};

start();
