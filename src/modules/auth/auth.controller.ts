import { FastifyInstance, RouteHandler } from "fastify";
import z from "zod";
import authSchema from "./auth.schema";
import { hashPassword, verifyPassword } from "../../utils/helpers";

const registerUser: RouteHandler<{
  Body: z.TypeOf<typeof authSchema.registerUser.body>;
  Reply: z.TypeOf<typeof authSchema.registerUser.response>;
}> = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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
};

const login: RouteHandler<{
  Body: z.TypeOf<typeof authSchema.login.body>;
  Reply: z.TypeOf<typeof authSchema.login.response>;
}> = async (req, res) => {
  const { email, password } = req.body;

  const user = await req.server.prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!user) {
    console.log("invalid email");
    throw req.server.httpErrors.unauthorized();
  }

  const passwordCheck = await verifyPassword(password, user.password);

  if (!passwordCheck) {
    console.log("invalid password");
    throw req.server.httpErrors.unauthorized();
  }

  req.session.set("user", {
    id: user.id,
    email: user.email,
  });

  res.send({
    success: true,
    data: {
      user,
    },
  });
};

const logOut: RouteHandler = async (req, res) => {
  req.session.delete();

  res.send({ success: true, message: "Logged out successfully" });
};

export default {
  registerUser,
  login,
  logOut,
};
