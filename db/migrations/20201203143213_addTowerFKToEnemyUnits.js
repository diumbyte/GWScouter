
exports.up = async function(knex, Promise) {
    await knex.schema.alterTable('enemy_units', table => {
        table.integer('tower_id').notNullable();

        // Foreign Keys
        table.foreign('tower_id').references('id').inTable('towers');
    });
};

exports.down = async function(knex, Promise) {
    await knex.schema.alterTable('enemy_units', table => {
        table.dropColumn('tower_id');
    })
};
