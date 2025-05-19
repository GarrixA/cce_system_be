import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";

interface OrganizationAttributes {
  id?: string;
  organization_name: string;
}

export class Organization
  extends Model<OrganizationAttributes>
  implements OrganizationAttributes
{
  public id!: string;
  public organization_name!: string;

  public static associate(models: {
    User: typeof database_models.User;
    Category: typeof database_models.Category;
  }) {
    // Organization has many Users
    this.hasMany(models.User, {
      foreignKey: "organization",
      as: "users",
    });

    // Organization has many Categories
    this.hasMany(models.Category, {
      foreignKey: "organizationId",
      as: "categories",
    });
  }
}

const Organization_model = (sequelize: Sequelize) => {
  Organization.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      organization_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "Organization",
      modelName: "Organization",
    }
  );
  return Organization;
};

export default Organization_model;
