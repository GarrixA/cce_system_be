import { Sequelize } from "sequelize";
import user_model from "./User";
import Role_model from "./Role";
import compliant_model from "./Compliants";
import category_model from "./Category";
import reply_model from "./Reply";
import Organization_model from "./Organization";
import token_model from "./Token";

const Models = (sequelize: Sequelize) => {
  const User = user_model(sequelize);
  const Role = Role_model(sequelize);
  const Compliants = compliant_model(sequelize);
  const Replies = reply_model(sequelize);
  const Category = category_model(sequelize);
  const Organization = Organization_model(sequelize);
  const Token = token_model(sequelize);

  return { User, Role, Category, Compliants, Replies, Organization, Token };
};

export default Models;
