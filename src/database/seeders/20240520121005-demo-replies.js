"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      "Replies",
      [
        {
          id: "44444444-4444-4444-4444-444444444444",
          reply_ownerId: "7121d946-7265-45a1-9ce3-3da1789e657e", // Link to a user
          reply_message: "Thank you for your feedback. We are investigating.",
          compliantId: "33333333-3333-3333-3333-333333333333",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete("Replies", null, {});
  },
};