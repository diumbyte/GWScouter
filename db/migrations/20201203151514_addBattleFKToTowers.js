
exports.up = async function(knex) {
  await knex.schema.alterTable('towers', table => {
    table.integer('battle_id').notNullable();

    // Foreign Keys
    table.foreign('battle_id').references('id').inTable('battles');
  })
};

exports.down = async function(knex) {
  await knex.schema.alterTable('towers', table => {
      table.dropColumn('battle_id');
  })
};
