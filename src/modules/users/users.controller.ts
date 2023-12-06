import { FastifyInstance, RouteHandler } from "fastify";
import z from "zod";
import usersSchema from "./users.schema";

const getUsers: RouteHandler<{
  Reply: z.TypeOf<typeof usersSchema.getUsers.response>;
}> = async (req, res) => {
  const users = await req.server.prisma.user.findMany();

  res.send({ success: true, users: users });
};

export default {
  getUsers,
};
