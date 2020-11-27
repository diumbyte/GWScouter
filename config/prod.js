module.exports = {
    discordClientId: process.env.DISCORD_CLIENT_ID,
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
    PGConnection: {
        host: process.env.HEROKU_PG_DB_HOST,
        user: process.env.HEROKU_PG_DB_USER,
        port: process.env.HEROKU_PG_DB_PORT,
        password: process.env.HEROKU_PG_DB_PW,
        database: process.env.HEROKU_PG_DB_DB,
        ssl: {
            rejectUnauthorized: false
        }
    },
    cookieKey: process.env.COOKIE_KEY
}