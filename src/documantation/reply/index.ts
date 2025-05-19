import { responses } from "../responses";

const create_borrow = {
  tags: ["Reply"],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: "Create a new reply",
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            full_name: {
              type: "string",
              description: "Full name of the reply",
              example: "John Doe",
            },
            national_id: {
              type: "string",
              description: "National ID of the reply",
              example: "1234567890",
            },
            email: {
              type: "string",
              description: "Email address of the reply",
              format: "email",
              example: "johndoe@example.com",
            },
            phone_number: {
              type: "string",
              description: "Phone number of the reply",
              example: "+1234567890",
            },
            residance_address: {
              type: "string",
              description: "Residential address of the reply",
              example: "123 Main Street, City, Country",
            },
            assurer_name: {
              type: "string",
              description: "Name of the assurer",
              example: "Jane Smith",
            },
            assurer_contact: {
              type: "string",
              description: "Contact information of the assurer",
              example: "+9876543210",
            },
            compliantId: {
              type: "string",
              description: "ID of the compliant being borrowed",
              format: "uuid",
            },
          },
          required: ["full_name", "national_id", "email", "compliantId"],
        },
      },
    },
  },
  consumes: ["application/json"],
  responses,
};

const read_borrows = {
  all: {
    tags: ["Reply"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "List all replies",
    description: "Retrieve a list of all borrowed compliants",
    responses,
  },
  single: {
    tags: ["Reply"],
    security: [
      {
        bearerAuth: [],
      },
    ],
    summary: "Get a single reply",
    description: "Retrieve details of a specific borrowed compliant",
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

const update_borrow = {
  tags: ["Reply"],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: "Update a reply",
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
            full_name: {
              type: "string",
              description: "Full name of the reply",
              example: "John Doe",
            },
            national_id: {
              type: "string",
              description: "National ID of the reply",
              example: "1234567890",
            },
            email: {
              type: "string",
              description: "Email address of the reply",
              format: "email",
              example: "johndoe@example.com",
            },
            phone_number: {
              type: "string",
              description: "Phone number of the reply",
              example: "+1234567890",
            },
            residance_address: {
              type: "string",
              description: "Residential address of the reply",
              example: "123 Main Street, City, Country",
            },
            assurer_name: {
              type: "string",
              description: "Name of the assurer",
              example: "Jane Smith",
            },
            assurer_contact: {
              type: "string",
              description: "Contact information of the assurer",
              example: "+9876543210",
            },
            compliantId: {
              type: "string",
              description: "ID of the compliant being borrowed",
              format: "uuid",
            },
          },
        },
      },
    },
  },
  responses,
};

const delete_borrow = {
  tags: ["Reply"],
  security: [
    {
      bearerAuth: [],
    },
  ],
  summary: "Delete a reply",
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

export const replies = {
  "/api/v1/replies": {
    post: create_borrow,
    get: read_borrows["all"],
  },
  "/api/v1/replies/{id}": {
    get: read_borrows["single"],
    patch: update_borrow,
    delete: delete_borrow,
  },
};
