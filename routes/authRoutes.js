const passport = require('passport');
const requireLogin = require('../middlewares/requireLogin');
const db = require('../db');

module.exports = (app) => {
    app.get('/auth/discord', passport.authenticate('discord'));
    
    app.get('/auth/discord/callback', passport.authenticate('discord'), (req, res) => {
        res.redirect('/Battle');
    });

    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/current_user', (req, res) => {
        if(req.user) {
            const { username } = req.user;
            return res.status(200).json(username);
        }

        res.status(200).json();
    });

    app.get('/auth/user_profile', requireLogin, async (req, res) => {
        const { user : {id} } = req;
        const userProfile = await db
                    .select('users.*', 'guilds.name as guild_name')
                    .from('users')
                    .leftJoin('guilds', 'users.guild_id', 'guilds.id')
                    .where('users.id','=',id)
                    .first();

        res.json(userProfile);
    });

    app.post('/auth/user', requireLogin, async (req, res) => {
        const updatedUser = await db('users')
                        .returning('*')
                        .where({id: req.user.id})
                        .update({
                            username: req.body.username,
                            guild_id: req.body.guild_id
                        });

        // User is requesting to leave current guild
        if (req.user.guild_id !== req.body.guild_id) {
            await db('user_guild_roles')
                .where({guild_id: req.user.guild_id})
                .del();
        }

        res.status(200).json(updatedUser[0]);
    });

}
