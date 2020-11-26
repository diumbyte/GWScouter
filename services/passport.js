const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const keys = require('../config/keys');
const db = require('../db/index');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const user = await db('users')
                        .select('*')
                        .where({id});
    done(null, user[0]);
});

passport.use(new DiscordStrategy({
    clientID: keys.discordClientId,
    clientSecret: keys.discordClientSecret,
    callbackURL: "/auth/discord/callback",
    proxy: true,
    scope: ['identify']
    }, async (accessToken, refreshToken, profile, done) => {
        const { username, id : discord_id } = profile;

        const user = await db('users')
                            .select("*")
                            .where("discord_id", discord_id);
        
        if (user.length === 0) {
            const newUser = await db('users').returning('*').insert({
                username,
                discord_id
            });
            console.log("New user", newUser);
            done(null, newUser[0]);
        } else {
            console.log("Existing user", user);
            done(null, user[0]);
        }
    })
);