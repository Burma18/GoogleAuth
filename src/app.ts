import fastify, { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import prisma from "./plugins/prisma";
import { routes } from "./routes";
import fastifySecureSession from "@fastify/secure-session";
import Sensible from "@fastify/sensible";
import fastifyOauth2 from "@fastify/oauth2";
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    userProtect: any;
    oauth2: any;
  }
}

export function buildServer() {
  const server: FastifyInstance = fastify();

  server.register(fastifySecureSession, {
    key: "aqgKIXJOqqa5/75kSP9/+2crKoGEi6xOjGh7ZesTa5w=",
    cookie: {
      secure: false,
    },
  });

  server.register(prisma);

  server.register(passport.initialize());

  // // @ts-ignore
  // server.register(fastifyOauth2, {
  //   name: "googleOAuth2",
  //   credentials: {
  //     client: {
  //       id: process.env.GOOGLE_CLIENT_ID,
  //       secret: process.env.GOOGLE_CLIENT_SECRET,
  //     },
  //     auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  //   },
  //   startRedirectPath: "/login-with-google",
  //   callbackUri: "http://localhost:4000/auth/google/callback",
  // });

  server.register(Sensible);

  server.register(routes, { prefix: "/api/v1" });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOGLE_CLIENT_SECRET,
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
        }

        console.log("reached google strategy");

        if (!newUser) cb(undefined, pulledUser);
        else {
          pulledUser.newUser = true;
          cb(undefined, pulledUser);
        }
      }
    )
  );

  server.get(
    "/auth/google/callback",
    {
      preValidation: (req, res, done) =>
        passport.authenticate("google", {
          session: false,
          scope: ["profile", "email"],
        })(req, res, done),
    },
    async (req, res) => {
      try {
        const user = req.user;

        console.log("user :", user);

        // Process the user information received from Google
        // Check if the user exists in your database, create a new user, or perform other actions
        // Return the appropriate response

        res.send({ success: true, user });
      } catch (error) {
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      }
    }
  );

  server.get("/ping", (req, res) => {
    res.send("pong");
  });

  return server;
}
