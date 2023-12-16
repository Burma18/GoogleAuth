import { generateSchema } from "@anatine/zod-openapi";
import { user } from "../../utils/schema";
import z from "zod";
import { UserRole } from "@prisma/client";

const getUsers = {
  response: z.object({
    success: z.boolean(),
    users: z.array(user),
  }),
};

const getUsersSchema = {
  response: {
    200: generateSchema(getUsers.response),
  },
};

const getUser = {
  params: z.object({
    id: z.number(),
  }),
  response: z.object({
    success: z.boolean(),
    user: user,
  }),
};

const getUserSchema = {
  params: generateSchema(getUser.params),
  response: {
    200: generateSchema(getUser.response),
  },
};

const changeUserRole = {
  params: z.object({
    id: z.number(),
  }),
  body: z.object({
    role: z.enum([
      UserRole.ADMIN,
      UserRole.BETATESTER,
      UserRole.INSTRUCTOR,
      UserRole.MENTOR,
      UserRole.SUPERADMIN,
      UserRole.USER,
    ]),
  }),
  response: z.object({
    success: z.boolean(),
    data: z.object({
      user,
    }),
  }),
};

const changeUserRoleSchema = {
  body: generateSchema(changeUserRole.body),
  params: generateSchema(changeUserRole.params),
  response: {
    200: generateSchema(changeUserRole.response),
  },
};

export default {
  getUsers,
  getUsersSchema,
  getUser,
  getUserSchema,
  changeUserRole,
  changeUserRoleSchema,
};
