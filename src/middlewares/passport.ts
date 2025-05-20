import { Request } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import database_models from "../database/config/db.config";
import { getRoleByName } from "../services/user.services";
import { hashPassword, isValidPassword } from "../utils/passwords";

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const role = await getRoleByName("CITIZEN");
        if (!role) {
          return done(null, false, { message: "You are assigned to no role" });
        }

        const data = {
          email: email.trim(),
          password: await hashPassword(password),
          confirmPassword: await hashPassword(req.body.confirmPassword),
          userName: req.body.userName ?? email.split("@")[0],
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          roleId: role.dataValues.id as string,
          phone_number: req.body.phone_number,
          isVerified: false,
        };

        console.log("🔹 User Data to Create:", data);

        const userExist = await database_models.User.findOne({
          where: { email: data.email },
        });

        if (userExist) {
          return done(null, false, { message: "User already exists!" });
        }

        const user = await database_models.User.create(data);

        return done(null, user);
      } catch (error) {
        console.error("Register error:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (_req: Request, email, password, done) => {
      try {
        const user = await database_models.User.findOne({
          where: { email },
          include: [
            {
              model: database_models.Role,
              as: "Role",
            },
          ],
        });

        if (!user) {
          return done(null, false, { message: "Wrong credentials!" });
        }

        const userJSON = user.toJSON();
        const currPassword = userJSON.password as string;

        const isValidPass = await isValidPassword(password, currPassword);
        if (!isValidPass) {
          return done(null, false, { message: "Wrong credentials!" });
        }

        if (!userJSON.isVerified) {
          return done(null, false, { message: "Verify your Account" });
        }

        return done(null, userJSON);
      } catch (error) {
        console.error("Login error:", error);
        return done(error);
      }
    }
  )
);

export default passport;
