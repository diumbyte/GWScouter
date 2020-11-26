
exports.seed = function(knex) {
  return knex('heroes').del()
    .then(function () {
      return knex('heroes').insert(require('../heroList'));
    });
};
