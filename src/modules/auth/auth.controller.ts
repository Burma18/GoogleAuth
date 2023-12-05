import { FastifyInstance, RouteHandler } from "fastify";
import z from "zod";
import authSchema from "./auth.schema";
import { hashPassword, verifyPassword } from "../../utils/helpers";

const registerUser: RouteHandler<{
  Body: z.TypeOf<typeof authSchema.registerUser.body>;
  Reply: z.TypeOf<typeof authSchema.registerUser.response>;
}> = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    const user = await req.server.prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });

    res.send({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const login: RouteHandler<{
  Body: z.TypeOf<typeof authSchema.login.body>;
  Reply: z.TypeOf<typeof authSchema.login.response>;
}> = async (req, res) => {
  const { email, password } = req.body;

  console.log("req.body :", req.body);

  try {
    const user = await req.server.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log("invalid email");
      throw new Error("invalid email");
    }

    const passwordCheck = await verifyPassword(password, user.password);

    if (!passwordCheck) {
      console.log("invalid password");
      throw new Error("invalid password");
    }

    console.log("user :", user);

    res.send({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  registerUser,
  login,
};
