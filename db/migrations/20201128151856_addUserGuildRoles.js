
exports.up = async function(db, Promise) {
    await db.schema.createTable('user_guild_roles', (table) => {
        table.integer('user_id');
        table.integer('guild_id');
        table.boolean('is_admin').notNullable();

        // Foreign Keys
        table.foreign('user_id').references('id').inTable('users');
        table.foreign('guild_id').references('id').inTable('guilds');

        // Composite Primary Key
        table.primary(['user_id', 'guild_id']);
    })
}

exports.down = async function(db, Promise) {
    await db.schema.dropTable('user_guild_roles');
};
