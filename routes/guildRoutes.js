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
                            .select('id as guild_id', 'name as guild_name', 'invite')
                            .where({id: req.user.guild_id})
                            .first();

        const {guild_name, invite, guild_id} = guildRes;

        const usersInGuild = await db('users')
                                .select(
                                    'users.username', 
                                    'users.id as userId', 
                                    'user_guild_roles.is_admin as isAdmin'
                                )
                                .join('user_guild_roles', 'users.id', 'user_guild_roles.user_id')
                                .where({'users.guild_id': req.user.guild_id});

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
            guildId: guild_id,
            guildName: guild_name,
            invite,
            usersInGuild,
            userIsGuildAdmin
        });
    })

    // Edit User guildId property
    app.delete('/api/guild/user/:userId', requireLogin, requireGuildAdmin, async (req, res) => {
        const {userId} = req.params;

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

    // Edit User isAdmin property of guild
    app.post('/api/guild/user/:userId', requireLogin, requireGuildAdmin, async (req, res) => {
        const { userId } = req.params;
        const { newIsAdmin, guildId } = req.body;

        console.log(guildId);

        if(guildId !== req.user.guild_id) {
            return res.status(400).json("You are not authorized");
        }

        await db('user_guild_roles')
                .where({
                    user_id: userId
                })
                .update({
                    is_admin: newIsAdmin
                });

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

        // Get guild id from inviteCode
        const guildRes = await db('guilds')
                            .select('id')
                            .where({
                                invite: inviteCode
                            })
                            .first();

        if(!guildRes) {
            return res.status(409).send("No guild found");
        }

        const { id : guildId } = guildRes;

        // Update user profile to joining guild
        await db('users')
                .where({
                    id: req.user.id
                })
                .update({
                    guild_id: guildId
                });

        // Update user_guild_roles. By default set to regular user
        await db('user_guild_roles')
                .insert({
                    guild_id: guildId,
                    user_id: req.user.id,
                    is_admin: false
                });
        
        res.status(200).json("Success");
    });
}