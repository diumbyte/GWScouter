
exports.seed = function(knex) {
  return knex('artifacts').del()
    .then(function () {
      return knex('artifacts').insert(require('../artifactList'));
    });
};
