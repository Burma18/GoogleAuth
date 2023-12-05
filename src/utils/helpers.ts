import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password: string) =>
  await bcrypt.hash(password, 10);

export const verifyPassword = async (
  passwordUser: string,
  passwordDB: string
) => await bcrypt.compare(passwordUser, passwordDB);

export const key = async () => await crypto.randomBytes(32).toString("hex");

console.log("key ", key);
