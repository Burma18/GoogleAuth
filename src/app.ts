import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prisma from "./plugins/prisma";
import { routes } from "./routes";
import fastifySecureSession from "@fastify/secure-session";
import Sensible from "@fastify/sensible";
import FastifyPassport from "@fastify/passport";
import auth from "./plugins/auth";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    protect: any;
    isAdmin: any;
    isMentor: any;
    googleOAuth2: any;
  }

  interface PassportUser extends User {}
}

export function buildServer() {
  const server: FastifyInstance = fastify();

  server.register(fastifySecureSession, {
    key: "aqgKIXJOqqa5/75kSP9/+2crKoGEi6xOjGh7ZesTa5w=",
    cookie: {
      secure: false,
    },
  });

  server.register(FastifyPassport.initialize());
  server.register(FastifyPassport.secureSession());

  server.register(auth);

  server.register(prisma);

  server.register(Sensible);

  server.register(routes, { prefix: "/api/v1" });

  FastifyPassport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `http://localhost:4000/auth/google/callback`,
        passReqToCallback: true,
      },
      async function (
        req: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        cb: any
      ) {
        let newUser = false;
        let pulledUser: any = await server.prisma.user.findFirst({
          where: {
            email: profile.email,
          },
        });

        console.log("pulledUser :", pulledUser);

        if (!pulledUser) {
          newUser = true;
          pulledUser = await server.prisma.user.create({
            data: {
              email: profile.email,
              password: "",
              firstName: profile?.given_name || "",
              lastName: profile?.family_name || "",
            },
          });

          if (!newUser) cb(undefined, pulledUser);
          else {
            pulledUser.newUser = true;
            cb(undefined, pulledUser);
          }
        }
      }
    )
  );

  server.get(
    "/auth/google/callback",
    {
      preValidation: (req: any, res) =>
        //@ts-ignore
        FastifyPassport.authenticate("google", {
          scope: ["profile", "email"],
        })(req, res),
    },
    async (req: any, res) => {
      const user = req.user;
      console.log("user from google :", user);

      res.redirect("http://localhost:4000/ping");

      if (!user) {
        res.redirect("http://localhost:4000");
        console.log("failed user google auth");
      }
    }
  );

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  return server;
}
