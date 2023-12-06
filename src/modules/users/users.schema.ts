import { generateSchema } from "@anatine/zod-openapi";
import { user } from "../../utils/schema";
import z from "zod";

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

export default {
  getUsers,
  getUsersSchema,
};
