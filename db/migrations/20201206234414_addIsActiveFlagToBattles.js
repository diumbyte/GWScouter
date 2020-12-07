
exports.up = async function(knex, Promise) {
    await knex.schema.alterTable('battles', table => {
        table.boolean('is_active').notNullable();
    });
};

exports.down = async function(knex) {
    await knex.schema.alterTable('battles', table => {
        table.dropColumn('is_active');
    })
};
