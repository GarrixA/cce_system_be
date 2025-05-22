"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Compliants",
      [
        {
          id: "33333333-3333-3333-3333-333333333333",
          name: "Spoiled Bread",
          description: "The bread was moldy.",
          status: "pending",
          email: "customer1@example.com",
          phone_number: "0781234567",
          images: ["img1.jpg", "img2.jpg"],
          categoryId: "22222222-2222-2222-2222-222222222222",
          organizationId: "11111111-1111-1111-1111-111111111111",
          isAnswered: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Compliants", null, {});
  },
};
