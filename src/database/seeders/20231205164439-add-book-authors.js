/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const authors = await queryInterface.sequelize.query(
      'SELECT * FROM Authors',
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );
    const books = await queryInterface.sequelize.query('SELECT * FROM Books', {
      type: Sequelize.QueryTypes.SELECT,
    });
    let rows = [];

    books.forEach((book) => {
      const numOfAuthors = Math.floor(Math.random() * 2) + 1;
      const start = Math.floor(Math.random() * (authors.length - 2)) + 1;
      const bookAuthors = authors.slice(start, start + numOfAuthors);

      rows = [
        ...rows,
        ...bookAuthors.map((el) => ({ bookId: book.id, authorId: el.id })),
      ];
    });

    return queryInterface.bulkInsert('BookAuthors', rows);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BookAuthors', null, {});
  },
};
