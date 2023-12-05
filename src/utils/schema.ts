import z from "zod";

export const user = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  password: z.string(),
});
