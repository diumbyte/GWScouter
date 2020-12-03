
exports.up = async function(knex) {
    await knex.schema.alterTable('battles', table => {
      table.boolean('current_battle').notNullable();
    })
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable('battles', table => {
        table.dropColumn('current_battle');
    })
  };
  