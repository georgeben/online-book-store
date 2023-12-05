/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const genres = await queryInterface.sequelize.query(
      'SELECT * FROM Genres',
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    const books = await queryInterface.sequelize.query('SELECT * FROM Books', {
      type: Sequelize.QueryTypes.SELECT,
    });
    let rows = [];

    books.forEach((book) => {
      const genre = genres[Math.floor(Math.random() * genres.length)];
      rows.push({
        bookId: book.id,
        genre: genre.name,
      });
    });

    return queryInterface.bulkInsert('BookGenres', rows);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('BookGenres', null, {});
  },
};
