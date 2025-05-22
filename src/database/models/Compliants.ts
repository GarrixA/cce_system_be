import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { Category } from "./Category";
import { Replies } from "./Reply";
import { Organization } from "./Organization";

interface ItemsAttributes {
  id?: string;
  name: string;
  description: string;
  images: string[];
  categoryId?: string;
  organizationId?: string;
  status?: string;
  email?: string;
  phone_number?: string;
  isAnswered?: boolean;
}

export class Compliants
  extends Model<ItemsAttributes>
  implements ItemsAttributes
{
  public images!: string[];
  public id!: string;
  public categoryId!: string;
  public organizationId!: string;
  public description!: string;
  public name!: string;
  public status!: string;
  public email!: string;
  public phone_number!: string;
  public isAnswered!: boolean;

  public static associate(models: {
    Category: typeof Category;
    Replies: typeof Replies;
    Organization: typeof Organization;
  }) {
    Compliants.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });

    Compliants.belongsTo(models.Organization, {
      foreignKey: "organizationId",
      as: "organization",
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
        allowNull: true,
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
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Organization",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isAnswered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
