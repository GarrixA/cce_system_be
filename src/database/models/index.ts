import { Sequelize } from "sequelize";
import Role_model from "./Role";
import user_model from "./User";
import token_model from "./Token";
import category_model from "./Category";
import compliant_model from "./Compliants";
import Organization_model from "./Organization";
import reply_model from "./Reply";

const Models = (sequelize: Sequelize) => {
  const User = user_model(sequelize);
  const Role = Role_model(sequelize);
  const Token = token_model(sequelize);
  const Category = category_model(sequelize);
  const Compliants = compliant_model(sequelize);
  const Organization = Organization_model(sequelize);
  const Replies = reply_model(sequelize);

  return { User, Role, Token, Category, Compliants, Organization, Replies };
};

export default Models;
