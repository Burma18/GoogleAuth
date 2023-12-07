import FastifyPassport from "@fastify/passport";
import { FastifyInstance } from "fastify";
import authSchema from "./auth.schema";
import authController from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/register",
    {
      schema: authSchema.registerUserSchema,
    },
    authController.registerUser
  );

  app.post(
    "/login",
    {
      preValidation: FastifyPassport.authenticate("local"),
      schema: authSchema.loginSchema,
    },
    authController.login
  );

  app.get("/logout", authController.logOut);
}
