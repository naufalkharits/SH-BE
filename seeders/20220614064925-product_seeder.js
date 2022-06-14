"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Products", [
      {
        name: "Chicken Soup",
        price: 50000,
        category_id: 1,
        description: "Delicious chicken soup",
        seller_id: 1,
      },
      {
        name: "Multivitamin",
        price: 150000,
        category_id: 2,
        description: "Multivitamin for healthy body",
        seller_id: 1,
      },
      {
        name: "Computer",
        price: 5000000,
        category_id: 3,
        description: "Complete computer setup for study and work",
        seller_id: 1,
      },
      {
        name: "Office Chair",
        price: 800000,
        category_id: 4,
        description: "Chair for relaxing at work",
        seller_id: 1,
      },
      {
        name: "Football Jersey",
        price: 750000,
        category_id: 5,
        description: "Football jersey from your favorite club",
        seller_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
