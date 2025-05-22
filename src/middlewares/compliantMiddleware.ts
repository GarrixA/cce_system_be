import { Request, Response, NextFunction } from "express";
import {
  compliantSchema,
  compliantIdSchema,
} from "../validations/compliantValidations";

export const isCompliantValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, description, email, categoryId } = req.body;
  const files = req.files as Express.Multer.File[];

  const errors = [];
  if (!name) errors.push("Name is required");
  if (!description) errors.push("Description is required");
  if (!email) errors.push("Email is required");
  if (!categoryId) errors.push("Category ID is required");
  if (!files || files.length < 1) errors.push("Images are required");

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(", ") });
  }
  next();
};

export const isCompliantIdValid = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = compliantIdSchema.validate({ id: req.params.id });
  if (error) {
    res
      .status(400)
      .json({ message: error.details[0].message.replace(/"/g, "") });
    return;
  }
  next();
};
