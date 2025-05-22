import { Request, Response } from "express";
import { sendResponse } from "../utils/httpRceptions";
import { read_function } from "../utils/db_methods";

interface CompliantAttributes {
  id?: string;
  name: string;
  description: string;
  images: string[];
  categoryId: string;
  status: string;
  email: string;
  phone_number?: string;
}

// Get Compliants by Organization
export const getCompliantsByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    console.log("User from token", user);

    // 1. Fetch user from DB to get organizationId
    const dbUser = await read_function<any>("User" as any, "findOne", {
      where: { id: user.id },
    });
    console.log("dbUser", dbUser);
    if (!dbUser || !dbUser?.dataValues?.organization) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "User or organizationId not found"
      );
      return;
    }

    const compliants = await read_function<CompliantAttributes[]>(
      "Compliants" as any,
      "findAll",
      { where: { organizationId: dbUser.dataValues.organization } }
    );

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Compliants fetched successfully",
      compliants
    );
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
    return;
  }
};

// Get single Compliant by Organization
export const getSingleCompliantByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Fetch user from DB to get organizationId
    const dbUser = await read_function<any>("User" as any, "findOne", {
      where: { id: user.id },
    });

    if (!dbUser || !dbUser?.dataValues?.organization) {
      sendResponse(res, 400, "NOT FOUND", "User or organizationId not found");
      return;
    }

    // Fetch compliant by id and organizationId
    const compliant = await read_function<CompliantAttributes | null>(
      "Compliants" as any,
      "findOne",
      {
        where: {
          id,
          organizationId: dbUser.dataValues.organization,
        },
      }
    );

    if (!compliant) {
      sendResponse(res, 404, "NOT FOUND", "Compliant not found");
      return;
    }

    sendResponse(
      res,
      200,
      "SUCCESS",
      "Compliant fetched successfully",
      compliant
    );
  } catch (error) {
    sendResponse(
      res,
      500,
      "ERROR",
      (error as Error).message || "Internal server error"
    );
    return;
  }
};
