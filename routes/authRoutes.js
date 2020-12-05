const router = require('express').Router();
const passport = require('passport');
const db = require('../db');
const requireLogin = require('../middlewares/requireLogin');
const userValidation = require('./validation/userValidation');

router.get('/auth/discord', passport.authenticate('discord'));

router.get('/auth/discord/callback', passport.authenticate('discord'), (req, res) => {
        return res.redirect('/Guild');
});

router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/index.html');
});

router.get('/auth/current_user', (req, res) => {
    if(req.user) {
        const {discord_id, ...user} = req.user;
        return res.status(200).json(user);
    }

    res.status(200).json();
});

router.get('/auth/user_profile', requireLogin, async (req, res) => {
    const { user : {id} } = req;
    const userProfile = await db
                .select('users.*', 'guilds.name as guild_name', 'guilds.invite')
                .from('users')
                .leftJoin('guilds', 'users.guild_id', 'guilds.id')
                .where('users.id','=',id)
                .first();

    // Don't include discord_id in returned JSON
    const { discord_id,...userToReturn} = userProfile;

    res.json(userToReturn);
});

router.post('/auth/user', requireLogin, userValidation, async (req, res) => {
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
            .where({
                guild_id: req.user.guild_id,
                user_id: req.user.id
            })
            .del();
    }

    res.status(200).json(updatedUser[0]);
});

module.exports = router;

