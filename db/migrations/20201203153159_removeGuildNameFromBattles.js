
exports.up = async function(knex) {
    await knex.schema.alterTable('battles', table => {
      table.dropColumn('enemy_guild_name')
    })
  };
  
  exports.down = async function(knex) {
    await knex.schema.alterTable('battles', table => {
        table.integer('enemy_guild_name').notNullable();
    })
  };
  