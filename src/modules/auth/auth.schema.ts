import { user } from "../../utils/schema";
import z from "zod";
import { generateSchema } from "@anatine/zod-openapi";

const registerUser = {
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
  }),
  response: z.object({
    success: z.literal(true),
    data: z.object({
      user,
    }),
  }),
};

const registerUserSchema = {
  body: generateSchema(registerUser.body),
  response: {
    200: generateSchema(registerUser.response),
  },
};

const login = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
  response: z.object({
    success: z.literal(true),
    data: z.object({
      user,
    }),
  }),
};

const loginSchema = {
  body: generateSchema(login.body),
  response: {
    200: generateSchema(login.body),
  },
};

export default {
  registerUser,
  registerUserSchema,
  login,
  loginSchema,
};
