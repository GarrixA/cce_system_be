import { responses } from "../responses";

const create_category = {
  tags: ["Category"],
  summary: "Create a new category",
  security: [
    {
      bearerAuth: [],
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Category name",
              example: "Device",
            },
            description: {
              type: "string",
              description: "Brief description of the category",
              example: "This category includes various devices.",
            },
          },
          required: ["name"],
        },
      },
    },
  },
  responses,
};

const read_categories = {
  all: {
    tags: ["Category"],
    summary: "Get all categories",
    security: [
      {
        bearerAuth: [],
      },
    ],
    responses,
  },
  single: {
    tags: ["Category"],
    summary: "Get a single category",
    security: [
      {
        bearerAuth: [],
      },
    ],
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

const update_category = {
  tags: ["Category"],
  summary: "Update a category",
  security: [
    {
      bearerAuth: [],
    },
  ],
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
      "application/json": {
        schema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Updated category name",
              example: "Fancy Device",
            },
            description: {
              type: "string",
              description: "Updated category description",
              example: "A collection of advanced technology devices.",
            },
          },
          required: ["name"],
        },
      },
    },
  },
  responses,
};

const delete_category = {
  tags: ["Category"],
  summary: "Delete a category",
  security: [
    {
      bearerAuth: [],
    },
  ],
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

export const categories = {
  "/api/v1/categories": {
    post: create_category,
    get: read_categories.all,
  },
  "/api/v1/categories/{id}": {
    get: read_categories.single,
    patch: update_category,
    delete: delete_category,
  },
};
