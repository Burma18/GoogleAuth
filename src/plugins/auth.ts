import { FastifyInstance, FastifyRequest } from "fastify";
import FastifyPassport from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";
import { verifyPassword } from "../utils/helpers";
import fp from "fastify-plugin";
import { User } from "@prisma/client";
import { number } from "zod";

async function auth(app: FastifyInstance) {
  FastifyPassport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async function (email, password, done) {
        try {
          const user = await app.prisma.user.findFirst({
            where: {
              email,
            },
          });

          if (!user) {
            return done(app.httpErrors.unauthorized("User is not found"));
          }

          if (!verifyPassword(password, user.password)) {
            return done(app.httpErrors.unauthorized("Password is incorrect"));
          }

          return done(null, user);
        } catch (error) {
          const err = error as Error;
          console.log("error from authentication strategy :", err.message);
          return done(error);
        }
      }
    )
  );

  //   this goes for storage into the session
  FastifyPassport.registerUserSerializer<
    User,
    {
      id: number;
      email: string;
    }
  >(async (user) => {
    console.log("user from registerUserSerializer :", user);
    return {
      id: user.id,
      email: user.email,
    };
  });

  // this attaches user as req.user
  FastifyPassport.registerUserDeserializer<
    {
      id: number;
      email: string;
    },
    User | null
  >(async (user) => {
    console.log("registerUserDeserializer :", user);
    return await app.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });
  });

  app.decorate("protect", async function (req: FastifyRequest) {
    console.log("it reached protect middleware");
    if (req.isUnauthenticated()) {
      throw app.httpErrors.unauthorized();
    }
  });
}

export default fp(auth);
