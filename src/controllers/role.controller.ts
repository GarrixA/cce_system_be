import { Request, Response } from "express";
import { sequelizeConnection } from "../database/config/db.config";
import Role_model from "../database/models/Role";
import User_model from "../database/models/User";

const Role = Role_model(sequelizeConnection);
const User = User_model(sequelizeConnection);

const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roleName } = req.body;
    const upperCaseRoleName = roleName.toUpperCase();
    const newRole = await Role.create({ roleName: upperCaseRoleName });

    res.status(201).json({
      message: `${upperCaseRoleName} role created successfully`,
      role: newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({ roles });
  } catch (error) {
    console.error("Error retrieving roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json({ role });
  } catch (error) {
    console.error("Error retrieving role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    role.roleName = roleName;
    const updatedRole = await role.save();
    return res.status(200).json({
      message: `${updatedRole} role updated successfully`,
      updated_role: updatedRole,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const assignRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { roleName } = req.body;
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const Role = Role_model(User.sequelize!);
    const role = await Role.findOne({ where: { roleName } });
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }

    user.roleId = role.id;
    await user.save();

    const userData = {
      ...user.toJSON(),
      password: undefined,
      confirmPassword: undefined,
    };

    res.status(200).json({
      message: `Role ${role.roleName} assigned successfully to ${userData.lastName}`,
      userData,
    });
  } catch (error) {
    console.error("Error assigning role to user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }
    await role.destroy();
    res
      .status(200)
      .json({ message: `${role.roleName} Role deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRole,
};
