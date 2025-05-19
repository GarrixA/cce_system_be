import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Role_model from "../database/models/Role";
import { User } from "../database/models/User";
import { sendResponse } from "../utils/httpRceptions";

const SALT_ROUNDS = 10;

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "default_secret_key";

interface UserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  role: string;
  password: string;
  confirmPassword: string;
}

/**
 * Function that generates token
 * @param payload
 * @returns generated token
 */
const generateAccessToken = (payload: {
  userId: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
}) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "360h" });
};

/**
 * Function that handles login
 * @param req
 * @param res
 * @param next
 * @returns login response
 */
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      sendResponse(res, 400, "BAD REQUEST", "User not found");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      sendResponse(res, 400, "BAD REQUEST", "Invalid password");
      return;
    }

    const Role = Role_model(User.sequelize!);
    const role = await Role.findOne({ where: { id: user.role } });
    const roleName = role ? role.roleName : "Unknown";

    const { id, firstName, lastName, phone_number } = user;
    const token = generateAccessToken({
      userId: id,
      role: roleName,
      firstName,
      lastName,
      email,
      phone_number,
    });

    sendResponse(res, 200, "SUCCESS", "Login successful", { token });
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
 * Function that handles user registrations
 * @param req
 * @param res
 * @returns registered user
 */
const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone_number,
      password,
      confirmPassword,
    }: UserAttributes = req.body;

    const defaultUserRoleId = "11afd4f1-0bed-4a3b-8ad5-0978dabf8fcd";

    if (password !== confirmPassword) {
      res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User already exsist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone_number,
      role: defaultUserRoleId,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: req?.body?.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

/**
 * Function gets all the users
 * @param req
 * @param res
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "confirmPassword"] },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching users",
      error: (error as Error).message,
    });
  }
};

/**
 * Function get user by their ids
 * @param req
 * @param res
 * @returns single user
 */
const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "confirmPassword"] },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching user",
      error: (error as Error).message,
    });
  }
};

/**
 * Function that update users info
 * @param req
 * @param res
 * @returns updated user
 */
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const { firstName, lastName, email, password, role } = req.body;

    const hashedPassword = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : undefined;

    const updated = await User.update(
      { firstName, lastName, email, password: hashedPassword, role },
      { where: { id } }
    );

    console.log(updated, "Updated");

    if (!updated) {
      res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByPk(id);
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating user",
      error: (error as Error).message,
    });
  }
};

// Delete User by ID
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting user",
      error: (error as Error).message,
    });
  }
};

export default { login, signup, getUsers, getUserById, updateUser, deleteUser };
