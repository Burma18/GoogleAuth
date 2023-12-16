import { FastifyInstance } from "fastify";
import usersController from "./users.controller";
import usersSchema from "./users.schema";
import auth from "../../plugins/auth";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: app.protect,
      schema: usersSchema.getUsersSchema,
    },
    usersController.getUsers
  );

  app.get(
    "/:id",
    {
      preHandler: [app.isMentor],
      schema: usersSchema.getUserSchema,
    },
    usersController.getUser
  );

  app.patch(
    "/:id",
    {
      preHandler: [app.isAdmin],
      schema: usersSchema.changeUserRoleSchema,
    },
    usersController.changeUserRole
  );
}
