import { FastifyInstance } from "fastify";
import usersController from "./users.controller";
import usersSchema from "./users.schema";
import { userProtect } from "../../utils/helpers";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: userProtect,
      schema: usersSchema.getUsersSchema,
    },
    // @ts-ignore
    usersController.getUsers
  );
}
