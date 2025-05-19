import { DataTypes, Model, Sequelize, UUIDV4 } from "sequelize";
import database_models from "../config/db.config";

interface UserAttributes {
	id?: string;
	roleName: string;
}

class Role extends Model<UserAttributes> implements UserAttributes {
	public id!: string;
	public roleName!: string;

	public static associate(models: { User: typeof database_models.Role }) {
		Role.hasMany(models.User, { foreignKey: "role", as: "users" });
	}
}
const Role_model = (sequelize: Sequelize) => {
	Role.init(
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			roleName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "Roles",
			modelName: "Role",
		}
	);
	return Role;
};
export default Role_model;
