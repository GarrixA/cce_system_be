import { responses } from "../responses";

const organization_routes = {
  create: {
    tags: ["Organization"],
    summary: "Create a new organization",
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              organization_name: {
                type: "string",
                example: "cce_system Org",
              },
            },
            required: ["organization_name"],
          },
        },
      },
    },
    responses,
  },
  get_all: {
    tags: ["Organization"],
    security: [{ bearerAuth: [] }],
    summary: "Get all organizations",
    responses,
  },
  get_single: {
    tags: ["Organization"],
    summary: "Get organization by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses,
  },
  update: {
    tags: ["Organization"],
    summary: "Update organization by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              organization_name: {
                type: "string",
                example: "Updated Org Name",
              },
            },
            required: ["organization_name"],
          },
        },
      },
    },
    responses,
  },
  delete: {
    tags: ["Organization"],
    summary: "Delete organization by ID",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses,
  },
  assign_compliant_organization: {
    tags: ["Compliant", "Organization"],
    summary: "Assign an organization to a compliant based on category match",
    parameters: [
      {
        in: "path",
        name: "compliantId",
        required: true,
        schema: { type: "string" },
        description: "Compliant ID",
      },
    ],
    responses,
  },
};

export const organizations = {
  "/api/v1/organizations": {
    post: organization_routes.create,
    get: organization_routes.get_all,
  },
  "/api/v1/organizations/{id}": {
    get: organization_routes.get_single,
    patch: organization_routes.update,
    delete: organization_routes.delete,
  },
  "/api/v1/compliants/{compliantId}/assign-organization": {
    patch: organization_routes.assign_compliant_organization,
  },
};
