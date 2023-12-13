import { FastifyInstance } from "fastify";
import usersController from "./users.controller";
import usersSchema from "./users.schema";
import auth from "../../plugins/auth";

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      preHandler: app.isAdmin,
      schema: usersSchema.getUsersSchema,
    },
    usersController.getUsers
  );

  app.patch(
    "/:id",
    {
      preHandler: [app.protect, app.isAdmin],
      schema: usersSchema.changeUserRoleSchema,
    },
    usersController.changeUserRole
  );
}
