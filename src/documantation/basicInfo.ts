import { DEPLOYED_URL, SERVER_URL } from "../utils/keys";

const basicInfo = {
  openapi: "3.0.0",
  info: {
    title: "CCE_SYSTEM API",
    description: "cce_system api documentation",
    version: "1.0.0",
  },

  servers: [
    {
      url: DEPLOYED_URL ? DEPLOYED_URL : SERVER_URL,
      description: "My server",
    },
  ],
  security: [
    {
      google_auth: [],
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default basicInfo;
