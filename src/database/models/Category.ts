import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";
import { Compliants } from "./Compliants";

interface CategoryAttributes {
  id?: string;
  categoryName: string;
}

export class Category
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public categoryName!: string;

  public static associate(models: { Compliants: typeof Compliants }) {
    this.hasMany(models.Compliants, {
      foreignKey: "categoryId",
      as: "compliants",
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
