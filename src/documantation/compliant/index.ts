import { responses } from "../responses";

const createItem = {
  tags: ["Compliant"],
  security: [{ bearerAuth: [] }],
  summary: "Creating an compliant",
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          required: [
            "name",
            "title",
            "description",
            "categoryId",
            "status",
            "condition",
          ],
          properties: {
            name: {
              type: "string",
              description: "Compliant name",
              example: "Laptop",
            },
            title: {
              type: "string",
              description: "Compliant title",
              example: "High-End Laptop",
            },
            description: {
              type: "string",
              description: "Detailed description of the compliant",
              example: "A powerful laptop with 16GB RAM and 1TB SSD.",
            },
            status: {
              type: "string",
              description: "Availability status of the compliant",
              enum: ["available", "out_of_stock", "reserved"],
              example: "available",
            },
            condition: {
              type: "string",
              description: "Condition of the compliant",
              enum: ["new", "used", "good", "damaged"],
              example: "good",
            },
            serial_number: {
              type: "string",
              description: "Serial number of the compliant",
              example: "Was21f34L",
            },
            images: {
              type: "array",
              compliants: {
                type: "file",
              },
              minItems: 4,
            },
            categoryId: {
              type: "string",
              description: "Compliant category ID",
              format: "uuid",
              example: "8efe453c-b779-453c-b96e-afe656eeebab",
            },
          },
        },
      },
    },
  },
  consumes: ["multipart/form-data"],
  responses,
};

const read_items = {
  all: {
    tags: ["Compliant"],
    security: [{ bearerAuth: [] }],
    summary: "Retrieve all compliants",
    description: "Get a list of all compliants",
    responses,
  },
  single: {
    tags: ["Compliant"],
    security: [{ bearerAuth: [] }],
    summary: "Retrieve a single compliant",
    description: "Fetch a single compliant by its ID",
    parameters: [
      {
        in: "path",
        name: "id",
        required: true,
        schema: {
          type: "string",
          format: "uuid",
        },
      },
    ],
    responses,
  },
};

const update_item = {
  tags: ["Compliant"],
  security: [{ bearerAuth: [] }],
  summary: "Update an compliant",
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          required: [
            "name",
            "title",
            "description",
            "categoryId",
            "status",
            "condition",
          ],
          properties: {
            name: {
              type: "string",
              description: "Compliant name",
              example: "Laptop",
            },
            title: {
              type: "string",
              description: "Compliant title",
              example: "Gaming Laptop",
            },
            description: {
              type: "string",
              description: "Detailed description of the compliant",
              example: "An upgraded gaming laptop with RTX 4090.",
            },
            status: {
              type: "string",
              description: "Availability status of the compliant",
              enum: ["available", "out_of_stock", "reserved"],
              example: "available",
            },
            condition: {
              type: "string",
              description: "Condition of the compliant",
              enum: ["new", "used", "good", "damaged"],
              example: "good",
            },
            images: {
              type: "array",
              compliants: {
                type: "file",
              },
              minItems: 4,
            },
            categoryId: {
              type: "string",
              description: "Compliant category ID",
              format: "uuid",
            },
          },
        },
      },
    },
  },
  responses,
};

const delete_item = {
  tags: ["Compliant"],
  security: [{ bearerAuth: [] }],
  summary: "Delete an compliant",
  parameters: [
    {
      in: "path",
      name: "id",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  responses,
};

export const compliants = {
  "/api/v1/compliants": {
    post: createItem,
    get: read_items.all,
  },
  "/api/v1/compliants/{id}": {
    get: read_items.single,
    patch: update_item,
    delete: delete_item,
  },
};
