// User model
import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import {
  UserCreationAttributes,
  UserModelAttributes,
} from "../../types/models";
import database_models from "../config/db.config";

// interface UserAttributes {
// 	id?: string;
// 	firstName: string;
// 	lastName: string;
// 	userName: string;
// 	email: string;
// 	role?: string;
// 	password: string;
// 	confirmPassword: string;
// }

export class User extends Model<UserModelAttributes, UserCreationAttributes> {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phone_number!: string;
  public role!: string;
  public password!: string;
  public confirmPassword!: string;
  public organization!: string;
  public reply!: string;

  public static associate(models: {
    Compliants: typeof database_models.Compliants;
    Role: typeof database_models.Role;
    Organization: typeof database_models.Organization;
    Replies: typeof database_models.Replies;
  }) {
    this.hasMany(models.Compliants, {
      foreignKey: "userId",
      as: "compliants",
    });
    this.hasMany(models.Replies, {
      foreignKey: "reply_ownerId",
      as: "users",
    });
    this.belongsTo(models.Role, { as: "Role", foreignKey: "role" });
    this.belongsTo(models.Organization, {
      as: "Organization",
      foreignKey: "organization",
    });
  }
}

const user_model = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone_number: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Roles",
          key: "id",
        },
      },
      organization: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: "Organization",
          key: "id",
        },
      },
      reply: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: "Replies",
          key: "id",
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      confirmPassword: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

export default user_model;
