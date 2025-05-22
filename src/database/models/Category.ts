import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";
import { Compliants } from "./Compliants";

interface CategoryAttributes {
  id?: string;
  categoryName: string;
  organizationId: string;
}

export class Category
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public categoryName!: string;
  public organizationId!: string;

  public static associate(models: {
    Compliants: typeof Compliants;
    Organization: typeof database_models.Organization;
  }) {
    this.hasMany(models.Compliants, {
      foreignKey: "categoryId",
      as: "compliants",
    });

    // Category belongs to Organization (One-to-One)
    this.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
    });
  }
}

const category_model = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      tableName: "Categories",
      modelName: "Category",
    }
  );
  return Category;
};

export default category_model;
