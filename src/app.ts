import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prisma from "./plugins/prisma";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }

  interface FastifyRequest {}

  interface FastifyReply {}
}

export function buildServer() {
  const server: FastifyInstance = fastify();

  //   server.register(prisma);

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  return server;
}
