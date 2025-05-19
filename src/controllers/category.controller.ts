import { Request, Response } from "express";
import { Category } from "../database/models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;
    const newCategory = await Category.create({ categoryName });
    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error creating category", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating category", error: "Unknown error" });
    }
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ data: categories });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching categories", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error fetching categories", error: "Unknown error" });
    }
  }
};

// Get a category by ID
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ data: category });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error fetching category", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error fetching category", error: "Unknown error" });
    }
  }
};

// Update a category by ID
export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;
    const [updated] = await Category.update(
      { categoryName },
      { where: { id } }
    );
    if (!updated) {
      res.status(404).json({ message: "Category not found" });
    }
    const updatedCategory = await Category.findByPk(id);
    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error updating category", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error updating category", error: "Unknown error" });
    }
  }
};

// Delete a category by ID
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) {
      res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Error deleting category", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error deleting category", error: "Unknown error" });
    }
  }
};
