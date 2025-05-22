import { responses } from "../responses";

const compliant_organization_routes = {
  read_by_organization: {
    tags: ["Compliant Organization"],
    security: [{ bearerAuth: [] }],
    summary: "Get Compliants by Organization",
    description:
      "Returns all compliants where the organizationId matches the authenticated user's organizationId.",
    responses,
  },
  read_single_by_organization: {
    tags: ["Compliant Organization"],
    security: [{ bearerAuth: [] }],
    summary: "Get single Compliant by Organization",
    description:
      "Returns a single compliant by id where the organizationId matches the authenticated user's organizationId.",
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
};

export const compliantOrganization = {
  "/api/v1/compliantsorg/organization": {
    get: compliant_organization_routes["read_by_organization"],
  },
  "/api/v1/compliantsorg/organization/{id}": {
    get: compliant_organization_routes["read_single_by_organization"],
  },
};
