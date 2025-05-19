import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { Category } from "./Category";
import { Replies } from "./Reply";

interface ItemsAttributes {
  id?: string;
  name: string;
  description: string;
  images: string[];
  categoryId?: string;
  status?: string;
  email?: string;
  phone_number?: string;
}

export class Compliants
  extends Model<ItemsAttributes>
  implements ItemsAttributes
{
  public images!: string[];
  public id!: string;
  public categoryId!: string;
  public description!: string;
  public name!: string;
  public status!: string;
  public email!: string;
  public phone_number!: string;

  public static associate(models: {
    Category: typeof Category;
    Replies: typeof Replies;
  }) {
    Compliants.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Compliants.hasOne(models.Replies, {
      foreignKey: "compliantId",
      as: "reply",
    });
  }
}

const compliant_model = (sequelize: Sequelize) => {
  Compliants.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone_number: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Compliants",
      tableName: "Compliants",
    }
  );

  return Compliants;
};

export default compliant_model;
