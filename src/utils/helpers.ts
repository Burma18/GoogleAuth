import bcrypt from "bcrypt";
import crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const verifyPassword = async (
  passwordUser: string,
  passwordDB: string
) => await bcrypt.compare(passwordUser, passwordDB);

export const key = crypto.randomBytes(32).toString("base64");

export async function userProtect(
  req: FastifyRequest,
  res: FastifyReply,
  next: any
) {
  const user = req.session.get("user");
  console.log("session user :", user);
  if (!user) {
    throw req.server.httpErrors.unauthorized();
  } else {
    next();
  }
}

// passport.serializeUser((user: any, done: any) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id: any, done: any) => {
//   // Retrieve user from the database using 'id'
//   done(null, user);
// });
