import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import passport from "../middlewares/passport";
import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/httpRceptions";
import { sendEmail } from "../helpers/nodemailer";
import HTML_TEMPLATE from "../utils/email_template";
import {
  UserModelAttributes,
  TokenModelAttributes,
  UserModelInclude,
} from "../types/models";
import { InfoAttribute } from "../types/passport_types";
import { insert_function, read_function } from "../utils/db_methods";
import { generateAccessToken, TokenData } from "../helpers/security_helpers";
import { validateToken } from "../validations/token_validations";
import { BASE_URL } from "../utils/keys";
import randomatic from "randomatic";
import { User } from "../database/models/User";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "secret_key_off";

/**
 * REGISTER a new user and send email verification
 */
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.body) {
      passport.authenticate(
        "register",
        async (
          err: Error | null,
          user: UserModelAttributes | false,
          info: InfoAttribute
        ) => {
          if (err) {
            console.error("Passport error:", err);
            sendResponse(
              res,
              500,
              "SERVER ERROR",
              "Registration failed",
              err.message
            );
          }

          if (!user) {
            console.warn("Registration failed:", info?.message);
            return sendResponse(
              res,
              409,
              "CONFLICT",
              info?.message || "Registration failed"
            );
          }

          req.login(user, async (loginErr) => {
            if (loginErr) {
              console.error("Login error:", loginErr);
              return sendResponse(
                res,
                500,
                "SERVER ERROR",
                "Login failed",
                loginErr.message
              );
            }

            const token = generateAccessToken({
              id: user.id,
              role: user.roleId,
            });

            await insert_function<TokenModelAttributes>("Token", "create", {
              token,
            });

            const message = `
        <div style="...">
          <h3>Welcome to baseFood!</h3>
          <p>To complete your signup process, verify your account below:</p>
          <a href="${BASE_URL}/users/account/verify/${token}" style="...">Verify</a>
        </div>
      `;

            console.log("✅ Sending email to:", user.email);

            if (!user.email) {
              return sendResponse(
                res,
                500,
                "SERVER ERROR",
                "No email found on user object"
              );
            }

            await sendEmail({
              to: user.email,
              subject: "Verify Email",
              html: HTML_TEMPLATE(message, "Account verification"),
            });

            return sendResponse(
              res,
              201,
              "SUCCESS",
              "Account Created successfully, Please Verify your Account"
            );
          });
        }
      )(req, res, next);
    }
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Something went wrong!",
      (error as Error).message
    );
  }
};

/**
 * LOGIN
 */

const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "login",
    (error: Error, user: UserModelAttributes, info: InfoAttribute) => {
      if (error) {
        console.log("Login error details:", {
          message: error.message,
          stack: error.stack,
        });
        return sendResponse(
          res,
          400,
          "BAD REQUEST",
          `Login failed: ${error.message}`
        );
      }

      if (info) {
        console.log("Login info:", info);
        return sendResponse(res, 400, "BAD REQUEST", info.message);
      }

      if (!user) {
        return sendResponse(res, 400, "BAD REQUEST", "Invalid credentials");
      }

      req.login(user, async (err: Error) => {
        if (err) {
          console.log("Login Error ==========>>>>>>>", err);
          return sendResponse(res, 400, "BAD REQUEST", "Bad Request!");
        }

        const { id, email, firstName, lastName, isPasswordExpired } = user;
        const role = (user as UserModelInclude).Roles?.roleName;

        let authenticationtoken: string;
        let tokenData: TokenData;

        if (role === "ADMIN") {
          const otp = randomatic("0", 6);

          if (isPasswordExpired) {
            tokenData = { id, role, otp, isPasswordExpired };
          } else {
            tokenData = { id, role, otp };
          }
          authenticationtoken = generateAccessToken(tokenData);

          const host = `${BASE_URL}/users`;
          const authenticationlink = `${host}/2fa?token=${authenticationtoken}`;

          const message = `Hello ${firstName + " " + lastName},<br><br>

        You recently requested to loged in to basefood app. To complete the login process,Please enter the following verification code <br><br> OTP:${otp} <br><br> You can also use the following link along with the provided OTP to complete your login:<br><br> <a href ='${authenticationlink}' style="
      background-color: MediumSeaGreen;
      color: white;
      padding: 6px 20px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
    ">Click here to login</a> <br><br> If you didn't request this, you can safely ignore this email. Your account is secure.

        Thank you,<br><br>
        The baseFood technical Team`;

          const options = {
            to: email,
            subject: "Your Login Verification Code",
            html: HTML_TEMPLATE(message, "Account verification"),
          };
          await insert_function<TokenModelAttributes>("Token", "create", {
            token: authenticationtoken,
          });

          sendEmail(options);
          return sendResponse(
            res,
            202,
            "ACCEPTED",
            "Email sent for verification. Please check your inbox and enter the OTP to complete the authentication process."
          );
        } else {
          if (isPasswordExpired) {
            tokenData = { id, role, isPasswordExpired };
          } else {
            tokenData = { id, role };
          }
          authenticationtoken = generateAccessToken(tokenData);
          return sendResponse(
            res,
            200,
            "SUCCESS",
            "Login successfully!",
            authenticationtoken
          );
        }
      });
    }
  )(req, res, next);
};

/**
 * VERIFY email with token
 */
const accountVerify = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = await read_function<TokenModelAttributes>(
      "Token",
      "findOne",
      {
        where: { token: req.params.token },
      }
    );

    if (!token) {
      sendResponse(
        res,
        400,
        "BAD REQUEST",
        "Invalid or expired verification link"
      );
    }

    const { user } = validateToken(token.token, ACCESS_TOKEN_SECRET);
    console.log("User======>", user);
    if (!user) {
      sendResponse(res, 400, "BAD REQUEST", "Invalid token payload");
    }

    await insert_function<UserModelAttributes>(
      "User",
      "update",
      { isVerified: true },
      { where: { id: user?.id } }
    );

    await insert_function<TokenModelAttributes>("Token", "destroy", {
      where: { id: token.id },
    });

    sendResponse(res, 200, "SUCCESS", "Email verified successfully!");
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Verification failed",
      (error as Error).message
    );
  }
};

/**
 * GET all users
 */
const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await read_function<UserModelAttributes>("User", "findAll", {
      where: { isDeleted: false },
      attributes: { exclude: ["password"] },
    });
    sendResponse(res, 200, "SUCCESS", "Users fetched", users);
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Error fetching users",
      (error as Error).message
    );
  }
};

/**
 * GET user by ID
 */
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "confirmPassword"] },
    });

    if (!user) {
      sendResponse(res, 404, "NOT FOUND", "User not found");
    }

    sendResponse(res, 200, "SUCCESS", "User fetched", user);
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Error fetching user",
      (error as Error).message
    );
  }
};

/**
 * UPDATE user
 */
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const [affectedRows] = await insert_function<
      [number, UserModelAttributes[]]
    >("User", "update", req.body, {
      where: { id: req.params.id, isDeleted: false },
    });

    if (affectedRows === 0) {
      sendResponse(res, 404, "NOT FOUND", "User not found or not updated");
    }

    sendResponse(res, 200, "SUCCESS", "User updated");
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Error updating user",
      (error as Error).message
    );
  }
};

/**
 * DELETE user (soft delete)
 */
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const [affectedRows] = await insert_function<[number]>(
      "User",
      "update",
      { isDeleted: true },
      {
        where: { id: req.params.id },
      }
    );

    if (affectedRows === 0) {
      sendResponse(res, 404, "NOT FOUND", "User not found or already deleted");
    }

    sendResponse(res, 200, "SUCCESS", "User deleted");
  } catch (error) {
    sendResponse(
      res,
      500,
      "SERVER ERROR",
      "Error deleting user",
      (error as Error).message
    );
  }
};

export default {
  login,
  registerUser,
  accountVerify,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
