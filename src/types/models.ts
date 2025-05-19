import { Optional } from "sequelize";

export interface roleModelAttributes {
  id: string;
  roleName: string;
}
export type roleCreationAttributes = Optional<roleModelAttributes, "id">;

export interface UserModelAttributes {
  id?: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phone_number: string;
  role: string;
  password: string;
  confirmPassword: string;
  organization?: string;
  reply?: string;
}

export interface UserModelInclude extends UserModelAttributes {
  Roles: any;
}

export type UserCreationAttributes = Optional<
  UserModelAttributes,
  "userName"
> & {
  role?: string;
  firstName?: string;
  lastName?: string;
  phone_number?: string;
  gender?: string;
  birthDate?: Date;
  phoneNumber?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  profileImage?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  city?: string;
  zipCode?: number;
};

export type ProductCreationAttributes = Omit<ProductAttributes, "id">;

export interface UserModelInclude extends UserModelAttributes {
  Roles: any;
}

export interface TokenModelAttributes {
  id: string;
  token: string;
}

export type TokenCreationAttributes = Optional<TokenModelAttributes, "id">;

export interface ProductAttributes {
  id: string;
  name: string;
  title: number;
  images: string[];
  description: string;
  userId: string;
}
