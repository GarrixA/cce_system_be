import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import { Compliants } from "./Compliants";
import { User } from "./User";

interface BorrowerAttributes {
  id?: string;
  reply_ownerId: string;
  reply_message: string;
  compliantId?: string;
}

export class Replies
  extends Model<BorrowerAttributes>
  implements BorrowerAttributes
{
  public id!: string;
  public reply_ownerId!: string;
  public reply_message!: string;
  public compliantId!: string;

  public static associate(models: {
    Compliants: typeof Compliants;
    User: typeof User;
  }) {
    Replies.belongsTo(models.Compliants, {
      foreignKey: "compliantId",
      as: "compliant",
    });
    Replies.belongsTo(models.User, {
      foreignKey: "reply_ownerId",
      as: "users",
    });
  }
}

const reply_model = (sequelize: Sequelize) => {
  Replies.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      reply_ownerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Replies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reply_message: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      compliantId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Compliants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      sequelize,
      modelName: "Replies",
    }
  );

  return Replies;
};

export default reply_model;
