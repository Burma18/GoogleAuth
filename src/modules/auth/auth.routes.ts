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
      schema: authSchema.loginSchema,
    },
    authController.login
  );

  //   session=yz6PkBNEOQtm2RSlpl%2BgDFnhJXuVAIyFb%2FNbsAgAejS6NbTb5IN%2BVOdfsZBdHhpr2dFdPpk803d8pMA%3D%3BHE40nFpuhc33sFEPyo7DyRfjFD%2BgHna4

  app.get("/logout", authController.logOut);
}
