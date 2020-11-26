const ZONE_OPTIONS = require('../models/constants/ZoneOptions').names;
const TEAM_OPTIONS = require('../models/constants/TeamOptions').names;
exports.up = function(db) {
  return Promise.all([
    db.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('username', 40).notNullable();
        table.string('discord_id').unique().notNullable();
        table.integer('guild_id').unsigned();

        // Foreign keys
        table.foreign('guild_id').references('id').inTable('guilds');
    }),
    db.schema.createTable('guilds', (table) => {
        table.increments('id');
        table.string('name', 40).unique().notNullable();
        table.string('invite', 40).unique().notNullable();
    }),
    db.schema.createTable('battles', (table) => {
        table.increments('id');
        table.integer('guild_id').unsigned().notNullable();
        table.string('enemy_guild_name', 40).notNullable();
        table.timestamp('started_at');
        table.timestamp('ends_at');

        // Foreign keys
        table.foreign('guild_id').references('id').inTable('guilds');
    }),
    db.schema.createTable('towers', (table) => {
        table.increments('id');
        table.string('enemy_username', 40).notNullable();
        table.boolean('is_stronghold').notNullable();
        table.enu('zone', ZONE_OPTIONS).notNullable();
    }),
    db.schema.createTable('tower_history', (table) => {
        table.increments('id');
        table.integer('tower_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.text('action').notNullable();
        table.timestamp('updated_at').defaultTo(db.fn.now());

        // Foreign Keys
        table.foreign('user_id').references('id').inTable('users');
        table.foreign('tower_id').references('id').inTable('towers');
    }),
    db.schema.createTable('enemy_units', (table) => {
        table.increments('id');
        table.enu('team', TEAM_OPTIONS).notNullable();
        table.integer('unit_id').unsigned().notNullable();
        table.integer('artifact_id').unsigned().notNullable();
        table.integer('speed').defaultTo(0);
        table.integer('health').defaultTo(0);
        table.boolean('has_immunity').defaultTo(false);
        table.boolean('has_counter').defaultTo(false);
        
        // Foreign keys
        table.foreign('unit_id').references('id').inTable('heroes');
        table.foreign('artifact_id').references('id').inTable('artifacts');
    }),
    db.schema.createTable('artifacts', (table) => {
        table.increments('id');
        table.string('name').unique().notNullable();
        table.string('code').unique().notNullable();
    }),
    db.schema.createTable('artifact_alts', (table) => {
        table.increments('id');
        table.integer('artifact_id').unsigned().notNullable();
        table.string('alt_name').notNullable();

        // Foreign keys
        table.foreign('artifact_id').references('id').inTable('artifacts');
    }),
    db.schema.createTable('heroes', (table) => {
        table.increments('id');
        table.string('name').unique().notNullable();
        table.string('code').unique().notNullable();
    }),
    db.schema.createTable('heroes_alts', (table) => {
        table.increments('id');
        table.integer('heroes_id').unsigned().notNullable();
        table.string('alt_name').notNullable();

        // Foreign keys
        table.foreign('heroes_id').references('id').inTable('heroes');
    })
  ]);
};

exports.down = function(db) {
  return Promise.all([
    db.schema.dropTable('user'),
    db.schema.dropTable('guilds'),
    db.schema.dropTable('battles'),
    db.schema.dropTable('towers'),
    db.schema.dropTable('tower_history'),
    db.schema.dropTable('enemy_units'),
    db.schema.dropTable('artifacts'),
    db.schema.dropTable('artifact_alts'),
    db.schema.dropTable('heroes'),
    db.schema.dropTable('hero_alts')
  ]);
};
