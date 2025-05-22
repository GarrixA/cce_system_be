import { responses } from "../responses";

const compliant_routes = {
  create_compliant: {
    tags: ["Compliant"],
    summary: "Create Compliant",
    security: [],
    requestBody: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", example: "Spoiled food" },
              description: {
                type: "string",
                example: "The food was spoiled and inedible.",
              },
              email: { type: "string", example: "user@example.com" },
              phone_number: { type: "string", example: "+1234567890" },
              images: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary",
                },
              },
              categoryId: { type: "string", example: "uuid-category-id" },
            },
            required: ["name", "description", "email", "images", "categoryId"],
          },
        },
      },
    },
    responses,
  },
  read_all: {
    tags: ["Compliant"],
    security: [{ bearerAuth: [] }],
    summary: "Get all Compliants",
    responses,
  },
  read_single: {
    tags: ["Compliant"],
    security: [{ bearerAuth: [] }],
    summary: "Get single Compliant",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        description: "ID of the compliant to retrieve",
        schema: { type: "string" },
      },
    ],
    responses,
  },
  read_by_organization: {
    tags: ["Compliant"],
    security: [{ bearerAuth: [] }],
    summary: "Get Compliants by Organization",
    description:
      "Returns all compliants where the organizationId matches the authenticated user's organizationId.",
    responses,
  },
};

export const compliants = {
  "/api/v1/compliants": {
    post: compliant_routes["create_compliant"],
    get: compliant_routes["read_all"],
  },
  "/api/v1/compliants/organization": {
    get: compliant_routes["read_by_organization"],
  },
  "/api/v1/compliants/{id}": {
    get: compliant_routes["read_single"],
  },
};
