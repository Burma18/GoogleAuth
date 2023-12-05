import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prisma from "./plugins/prisma";
import { routes } from "./routes";
import fastifySecureSession from "@fastify/secure-session";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export function buildServer() {
  const server: FastifyInstance = fastify();

  server.register(fastifySecureSession, {
    key: "aqgKIXJOqqa5/75kSP9/+2crKoGEi6xOjGh7ZesTa5w=",
    cookie: {
      secure: false,
    },
  });

  server.register(prisma);

  server.register(routes, { prefix: "/api/v1" });

  //   const key = crypto.randomBytes(32).toString("base64");

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  return server;
}
