module.exports = {

  development: {
    client: 'postgresql',
    connection: require('./config/keys').PGConnection,
    migrations: {
      tableName: 'knex_migrations',
      directory: `${ __dirname }/db/migrations`
    },
    seeds: {
      directory: `${ __dirname }/db/seeds`
    }
  },

  production: {
    client: 'postgresql',
    connection: require('./config/keys').PGConnection,
    migrations: {
      tableName: 'knex_migrations',
      directory: `${ __dirname }/db/migrations`
    },
    seeds: {
      directory: `${ __dirname }/db/seeds`
    }
  }

};
