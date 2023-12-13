import { FastifyInstance, RouteHandler } from "fastify";
import z from "zod";
import usersSchema from "./users.schema";
import { Prisma } from "@prisma/client";

const getUsers: RouteHandler<{
  Reply: z.TypeOf<typeof usersSchema.getUsers.response>;
}> = async (req, res) => {
  const users = await req.server.prisma.user.findMany();

  res.send({ success: true, users: users });
};

const changeUserRole: RouteHandler<{
  Params: z.TypeOf<typeof usersSchema.changeUserRole.params>;
  Body: z.TypeOf<typeof usersSchema.changeUserRole.body>;
  Reply: z.TypeOf<typeof usersSchema.changeUserRole.response>;
}> = async (req, res) => {
  const id = req.params.id;

  const { role } = req.body;

  const where: Prisma.UserWhereInput = {
    id,
  };

  const user = await req.server.prisma.user.findFirst({
    where,
  });

  if (!user) {
    throw req.server.httpErrors.notFound("No user found");
  }

  const updatedUser = await req.server.prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
  });

  res.send({
    success: true,
    data: {
      user: updatedUser,
    },
  });
};

export default {
  getUsers,
  changeUserRole,
};
