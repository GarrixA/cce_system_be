import { responses } from "../responses";

const reply_routes = {
  create_reply: {
    tags: ["Reply"],
    security: [{ bearerAuth: [] }],
    summary: "Create a Reply",
    description:
      "Create a reply for a compliant. The reply owner is set from the authenticated user and the compliant must belong to the user's organization.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              compliantId: { type: "string", example: "uuid-of-compliant" },
              reply_message: {
                type: "string",
                example: "Thank you for your feedback.",
              },
            },
            required: ["compliantId", "reply_message"],
          },
        },
      },
    },
    responses,
  },
};

export const replies = {
  "/api/v1/replies": {
    post: reply_routes["create_reply"],
  },
};
