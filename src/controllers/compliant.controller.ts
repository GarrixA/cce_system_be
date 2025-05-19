import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { sequelizeConnection } from "../database/config/db.config";
import Item_model from "../database/models/Compliants";
import { deleteCloudinaryFile, uploadMultiple } from "../helpers/upload";
import { Info } from "../types/upload";

export interface ExpandedRequest extends Request {
  user?: JwtPayload;
}
const Compliants = Item_model(sequelizeConnection);

const createItem = async (req: Request, res: Response): Promise<void> => {
  const { name, title, description, categoryId, email, status, phone_number } =
    req.body;
  const files = req.files as Express.Multer.File[];

  if (!name || !title || !description) {
    res.status(400).json({ message: "Required fields are missing!" });
  }

  const uploadedImages = await uploadMultiple(files, req);

  if ((req as Info<any>).info?.message) {
    res.status(400).json({ message: (req as Info<any>).info.message });
  }

  try {
    const compliant = await Compliants.create({
      name,
      description,
      email,
      status,
      phone_number,
      images: uploadedImages.images,
      categoryId,
    });

    res
      .status(201)
      .json({ message: `${compliant.name} is created`, compliant });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const compliant = await Compliants.findByPk(id);
    if (!compliant) {
      res.status(404).json({ message: "Compliants not found!" });
      return;
    }

    for (const imageUrl of compliant.images) {
      await deleteCloudinaryFile(imageUrl);
    }

    await compliant.destroy();
    res.status(200).json({ message: `Item deleted successfully!` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description, categoryId, email, status, phone_number } =
    req.body;

  try {
    const compliant = await Compliants.findByPk(id);
    if (!compliant) {
      res.status(404).json({ message: "Compliants not found!" });
      return;
    }

    let updatedImages = compliant.images;
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      const uploadedImages = await uploadMultiple(
        req.files as Express.Multer.File[],
        req
      );
      if (uploadedImages.message) {
        res.status(400).json({ message: uploadedImages.message });
      }
      updatedImages = [...updatedImages, ...uploadedImages.images];
    }

    await compliant.update({
      name: name ?? compliant.name,
      description: description ?? compliant.description,
      images: updatedImages,
      categoryId: categoryId ?? compliant.categoryId,
      email: email ?? compliant.email,
      status: status ?? compliant.status,
      phone_number: phone_number ?? compliant.phone_number,
    });

    res.status(200).json({ meaage: `${compliant.name} update` });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const compliant = await Compliants.findByPk(id);
    if (!compliant) {
      res.status(404).json({ message: "Item not found!" });
    }
    res.status(200).json(compliant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const compliants = await Compliants.findAll();
    res.status(200).json(compliants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
