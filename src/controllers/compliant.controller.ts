import { Request, Response } from "express";
import { sendResponse } from "../utils/httpRceptions";
import { read_function, insert_function } from "../utils/db_methods";
import { ValidationError } from "sequelize";
import { uploadMultiple } from "../helpers/upload";

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

// Create Compliant
export const createCompliant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract files and fields from the request
    const files = req.files as Express.Multer.File[];
    const { name, description, email, phone_number, categoryId } = req.body;

    // Validate required fields
    if (!name || !description || !email || !categoryId) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Required fields are missing!"
      );
      return;
    }

    // Check if categoryId exists
    const category = await read_function<any>("Category" as any, "findOne", {
      where: { id: categoryId },
    });
    if (!category) {
      sendResponse(
        res,
        400,
        "VALIDATION_ERROR",
        "Provided categoryId does not exist."
      );
      return;
    }

    // Upload images to Cloudinary
    const uploadedImages = await uploadMultiple(files, req);

    // If uploadMultiple set an error message, return it
    if ((req as any).info?.message) {
      sendResponse(res, 400, "VALIDATION_ERROR", (req as any).info.message);
      return;
    }

    const compliantData = {
      name,
      description,
      email,
      phone_number,
      categoryId,
      images: uploadedImages.images,
      status: "pending",
    };

    const compliant = await insert_function<CompliantAttributes>(
      "Compliants" as any,
      "create",
      compliantData
    );
    sendResponse(
      res,
      201,
      "SUCCESS",
      "Compliant created successfully",
      compliant
    );
  } catch (error) {
    console.log("Error creating compliant:", error);
    if (error instanceof ValidationError) {
      // Collect all error messages
      const messages = error.errors.map((e) => e.message);
      sendResponse(res, 400, "VALIDATION_ERROR", messages.join(", "));
    } else {
      sendResponse(
        res,
        500,
        "ERROR",
        (error as Error).message || "Internal server error"
      );
      return;
    }
  }
};

// Get all Compliants
export const getCompliants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const compliants = await read_function<CompliantAttributes[]>(
      "Compliants" as any,
      "findAll"
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

// Get Compliants by Organization
export const getCompliantsByOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = (req as any).user;
    console.log("User in getCompliantsByOrganization:", user);
    if (!user || !user.organizationId) {
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
      { where: { organizationId: user.organizationId } }
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

// Get single Compliant by ID
export const getCompliantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const compliant = await read_function<CompliantAttributes | null>(
      "Compliants" as any,
      "findOne",
      { where: { id } }
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

export const assignCompliantOrganization = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { compliantId } = req.params;

    // Find the compliant
    const compliant = await read_function<any>("Compliants" as any, "findOne", {
      where: { id: compliantId },
    });
    if (!compliant) {
      sendResponse(res, 404, "NOT FOUND", "Compliant not found");
      return;
    }

    // Find the organization that has a category matching compliant.categoryId
    const category = await read_function<any>("Category" as any, "findOne", {
      where: { id: compliant.categoryId },
    });
    if (!category) {
      sendResponse(res, 404, "NOT FOUND", "Category not found");
      return;
    }

    const organizationId = category.organizationId;
    if (!organizationId) {
      sendResponse(
        res,
        404,
        "NOT FOUND",
        "No organization found for this category"
      );
      return;
    }

    // Update compliant's organizationId and status
    await insert_function<any>(
      "Compliants" as any,
      "update",
      { organizationId, status: "processing" },
      { where: { id: compliantId } }
    );

    // Fetch the organization to get its name
    const organization = await read_function<any>(
      "Organization" as any,
      "findOne",
      { where: { id: organizationId } }
    );

    sendResponse(
      res,
      200,
      "SUCCESS",
      `Compliant assigned to ${
        organization?.organization_name || "Organization"
      }`,
      {
        compliantId,
        organizationId,
        organization_name: organization?.organization_name || null,
      }
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
