const crypto = require('crypto');
const requireLogin = require('../middlewares/requireLogin');
const requireGuild = require('../middlewares/requireGuild');
const requireGuildAdmin = require('../middlewares/requireGuildAdmin');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/guild', requireLogin, requireGuild, async (req, res) => {
        const guildRes = await db('guilds')
                            .select('name as guild_name', 'invite')
                            .where({id: req.user.guild_id})
                            .first();

        const {guild_name, invite} = guildRes;

        const usersInGuild = await db('users')
                                .select('username', 'id as userId')
                                .where({guild_id: req.user.guild_id});

        const { is_admin : userIsGuildAdmin} = await db('user_guild_roles') 
                                        .select('is_admin')
                                        .where({
                                            user_id: req.user.id,
                                            guild_id: req.user.guild_id
                                        })
                                        .first();

        // const {is_admin : userIsGuildAdmin} = userIsGuildAdminRes[0];

        res.status(200).json({
            guildName: guild_name,
            invite,
            usersInGuild,
            userIsGuildAdmin
        });
    })

    app.post('/api/guild/user', requireLogin, requireGuildAdmin, async (req, res) => {
        const {userId} = req.body;

        console.log(userId);
        // Removing user from guild
        await db('users')
                .where({
                    guild_id: req.user.guild_id,
                    id: userId
                })
                .update({
                    guild_id: null
                });

        // Modifying user role tables
        await db('user_guild_roles')
                .where({
                    guild_id: req.user.guild_id,
                    user_id: userId
                })
                .del();

        res.status(200).json("Success");
    })

    app.post('/api/guild/invite', requireLogin, requireGuildAdmin, async (req, res) => {
        
        // Ensure no collisions
        let newInviteLink;
        let collisionCheck;
        
        do {
            newInviteLink = crypto.randomBytes(4).toString('hex');
            
            collisionCheck = await db('guilds')
            .select("invite")
            .where({
                invite: newInviteLink
            })
            .first();
        } while(collisionCheck)

        await db('guilds')
                .where({
                    id: req.user.guild_id
                })
                .update({
                    invite: newInviteLink
                });


        res.status(200).json(newInviteLink);
    });
}
