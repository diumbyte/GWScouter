const generateNewInviteCode = require('../helpers/guildHelpers')
const requireLogin = require('../middlewares/requireLogin');
const requireGuild = require('../middlewares/requireGuild');
const requireGuildAdmin = require('../middlewares/requireGuildAdmin');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/guild/:inviteCode', async (req, res) => {
        const guildRes = await db('guilds')
                            .select('name as guild_name', 'invite')
                            .where({invite: req.params.inviteCode})
                            .first();

        const {guild_name, invite} = guildRes;
        res.status(200).json({
            guildName: guild_name,
            inviteCode: invite
        })
    });
    
    app.get('/api/guild', requireLogin, requireGuild, async (req, res) => {
        const guildRes = await db('guilds')
                            .select('name as guild_name', 'invite')
                            .where({id: req.user.guild_id})
                            .first();

        const {guild_name, invite} = guildRes;

        const usersInGuild = await db('users')
                                .select('username', 'id as userId')
                                .where({guild_id: req.user.guild_id});

        const adminResult = await db('user_guild_roles') 
                                        .select('is_admin')
                                        .where({
                                            user_id: req.user.id,
                                            guild_id: req.user.guild_id
                                        })
                                        .first();

        const userIsGuildAdmin = adminResult ? adminResult.is_admin : false;
        // const {is_admin : userIsGuildAdmin} = userIsGuildAdminRes[0];

        res.status(200).json({
            userId: req.user.id,
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
        
        const newInviteLink = await generateNewInviteCode(db);

        await db('guilds')
                .where({
                    id: req.user.guild_id
                })
                .update({
                    invite: newInviteLink
                });


        res.status(200).json(newInviteLink);
    });

    app.post('/api/guild/new', requireLogin, async (req, res) => {
        const { guildName } = req.body;
        const newInviteLink = await generateNewInviteCode(db);

        // Create Guild
        const newGuild = await db('guilds')
                        .returning('id')
                        .insert({
                            name: guildName,
                            invite: newInviteLink
                        });
        
        const newGuildId = newGuild[0];

        console.log(newGuildId);

        // Update current user that created guild 
        await db('users')
                .where({
                    id: req.user.id
                })
                .update({
                    guild_id: newGuildId
                });

        // Update user_guild_roles to set current user as admin of created guild
        await db('user_guild_roles')
                .insert({
                    user_id: req.user.id,
                    guild_id: newGuildId, 
                    is_admin: true
                });
        
        res.status(200).json("Success");
        console.log(guildName);
    })
    
    app.post('/api/guild/join/:inviteCode', requireLogin, async (req, res) => {
        const { inviteCode } = req.params;

        const guildRes = await db('guilds')
                            .select('id')
                            .where({
                                invite: inviteCode
                            })
                            .first();

        if(!guildRes) {
            return res.status(401).json("No guild found");
        }

        const { id : guildId } = guildRes;

        await db('users')
                .where({
                    id: req.user.id
                })
                .update({
                    guild_id: guildId
                });
        
        res.status(200).json("Success");
    });
}
