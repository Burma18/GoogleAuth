import { FastifyInstance } from "fastify";
import { authRoutes } from "../modules/auth/auth.routes";
import userRoutes from "../modules/users/users.routes";

export async function routes(app: FastifyInstance) {
  app.register(authRoutes);
  app.register(userRoutes, { prefix: "/users" });
}
