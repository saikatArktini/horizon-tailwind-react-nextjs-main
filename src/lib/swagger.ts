import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fin Pro",
      version: "1.0.0",
      description: "API documentation for Fin Pro banking service",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    // 🔐 REQUIRED FOR AUTHORIZE BUTTON
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    // 🔐 OPTIONAL: apply auth globally
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/app/api/**/*.ts",
    "./src/lib/requireAuth.ts",
  ],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
