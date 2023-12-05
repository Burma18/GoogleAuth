import { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes";

export async function routes(app: FastifyInstance) {
  app.register(authRoutes);
}
