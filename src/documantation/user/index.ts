import { responses } from "../responses";

const register_login = {
  register: {
    tags: ["User"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Register user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                description: "Email address",
                required: true,
                example: "email@example.com",
              },
              firstName: {
                type: "string",
                description: "Your first name",
                required: true,
                example: "kalake",
              },
              lastName: {
                type: "string",
                description: "Your last name",
                required: true,
                example: "kalisa",
              },
              phone_number: {
                type: "string",
                description: "Your last name",
                required: true,
                example: "0192837465",
              },
              password: {
                type: "string",
                description: "Password",
                required: true,
                example: "passwordQWE123",
              },
              confirmPassword: {
                type: "string",
                description: "Confirm Password",
                required: true,
                example: "passwordQWE123",
              },
            },
          },
        },
      },
    },
    responses,
  },

  login: {
    tags: ["User"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Login user",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: {
                type: "string",
                description: "Email address",
                required: true,
                example: "email@example.com",
              },
              password: {
                type: "string",
                description: "User password",
                required: true,
                example: "passwordQWE123",
              },
            },
          },
        },
      },
    },
    consumes: ["application/json"],
    responses,
  },

  logout: {
    tags: ["User"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Log out a user",
    consumes: ["application/json"],
    responses,
  },
};

const get_users = {
  users: {
    tags: ["User"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "get all users",
    consumes: ["application/json"],
    responses,
  },
};

export const users = {
  "/api/v1/users/register": {
    post: register_login["register"],
  },
  "/api/v1/users/login": {
    post: register_login["login"],
  },
  "/api/v1/users": {
    get: get_users["users"],
  },
  "/api/v1/users/logout": {
    post: register_login["logout"],
  },
};
