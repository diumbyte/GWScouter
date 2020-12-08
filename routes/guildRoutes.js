const router = require('express').Router();
const generateNewInviteCode = require('../helpers/guildHelpers')
const requireLogin = require('../middlewares/requireLogin');
const requireGuild = require('../middlewares/requireGuild');
const requireGuildAdmin = require('../middlewares/requireGuildAdmin');
const { nextTargetDayOfWeek, isActiveBattleSession, startBattleSession, endBattleSession } = require('../helpers/dateHelpers')
const adminValidation = require('./validation/adminEditMemberValidation');
const newGuildValidation = require('./validation/newGuildValidation');

const db = require('../db');

router.get('/api/guild/:inviteCode', async (req, res) => {
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

router.get('/api/guild', requireLogin, requireGuild, async (req, res) => {
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
router.delete('/api/guild/user/:userId', requireLogin, requireGuildAdmin, async (req, res) => {
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
router.post('/api/guild/user/:userId', 
            requireLogin, 
            requireGuildAdmin, 
            adminValidation,
    async (req, res) => {
        const { userId } = req.params;
        const { newIsAdmin, guildId } = req.body;

        if(guildId !== req.user.guild_id) {
            return res.status(400).json({errors: [{msg: "You are not authorized."}]});
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

router.post('/api/guild/invite', requireLogin, requireGuildAdmin, async (req, res) => {
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

router.post('/api/guild/new', requireLogin, newGuildValidation, async (req, res) => {
    const { guildName } = req.body;
    const newInviteLink = await generateNewInviteCode(db);

    // Create Guild
    let newGuild;
    try {
        newGuild = await db('guilds')
                    .returning('id')
                    .insert({
                        name: guildName,
                        invite: newInviteLink
                    });
    } catch (err) {
        return res.status(400).json({ errors: [{msg: "Guild name already taken."}]});
    }

    const newGuildId = newGuild[0];
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

    

    // Create a new battle to link to guild
    let ends_at;
    if(isActiveBattleSession()) {
        ends_at = endBattleSession(startBattleSession());
    } else {
        ends_at = nextTargetDayOfWeek([1,3,5]).toJSDate();
    }

    await db('battles')
            .insert({
                guild_id: newGuildId,
                ends_at,
                current_battle: true,
                is_active: isActiveBattleSession()
            });
    
    res.status(200).json("Success");
})

router.post('/api/guild/join/:inviteCode', requireLogin, async (req, res) => {
    const { inviteCode } = req.params;

    // Get guild id from inviteCode
    const guildRes = await db('guilds')
                        .select('id')
                        .where({
                            invite: inviteCode
                        })
                        .first();

    if(!guildRes) {
        return res.status(409).json({ errors: [{msg: "No guild found."}]});
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

module.exports = router;
