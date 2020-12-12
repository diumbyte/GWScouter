const db = require('../db');

const getRandomIntNearNumber = (number, isHero) => {
    const heroIdMin = process.env.NODE_ENV === 'production' ? 986 : 1;
    const heroIdMax = process.env.NODE_ENV === 'production' ? 1183 : 198;
    const artifactUnknown = process.env.NODE_ENV === 'production' ? 751 : 1;
    const artifactIdMin = process.env.NODE_ENV === 'production' ? 760 : 10;
    const artifactIdMax = process.env.NODE_ENV === 'production' ? 806 : 56;

    // Artifact id is unknown. Keep it as that.
    if ( !isHero && (number === artifactUnknown) ){
        return number;
    }

    return isHero 
                ? Math.floor(Math.random() * (heroIdMax - heroIdMin + 1) + heroIdMin)
                : Math.floor(Math.random() * (artifactIdMax - artifactIdMin + 1) + artifactIdMin)
}

const dummyTowers = (battleId) => [
    {
        enemy_username: "Enemy 1",
        is_stronghold: true,
        zone: "top",
        battle_id: battleId
    },
    {
        enemy_username: "Enemy 2",
        is_stronghold: false,
        zone: "top",
        battle_id: battleId
    },
    {
        enemy_username: "Enemy 3",
        is_stronghold: false,
        zone: "top",
        battle_id: battleId
    },
    {
        enemy_username: "Enemy 4",
        is_stronghold: true,
        zone: "mid",
        battle_id: battleId
    },
    {
        enemy_username: "Enemy 4",
        is_stronghold: true,
        zone: "bot",
        battle_id: battleId
    },
    {
        enemy_username: "Enemy 5",
        is_stronghold: true,
        zone: "main",
        battle_id: battleId
    },
]

const dummyEnemyUnits = (towerId) => [
    {
        tower_id: towerId,
        team: "teamOne",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 990 : 59, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 756 : 45, false),
        speed: 160,
        health: 15000,
        has_immunity: false,
        has_counter: false
    },
    {
        tower_id: towerId,
        team: "teamOne",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 993 : 5, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 753 : 6, false),
        speed: 220,
        health: 0,
        has_immunity: false,
        has_counter: false
    },
    {
        tower_id: towerId,
        team: "teamOne",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 1044 : 8, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 795 : 3, false),
        speed: 260,
        health: 0,
        has_immunity: false,
        has_counter: false
    },
    {
        tower_id: towerId,
        team: "teamTwo",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 1025 : 57, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 751 : 1, false),
        speed: 0,
        health: 0,
        has_immunity: false,
        has_counter: false
    },
    {
        tower_id: towerId,
        team: "teamTwo",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 1042 : 40, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 751 : 1, false),
        speed: 220,
        health: 22000,
        has_immunity: true,
        has_counter: false
    },
    {
        tower_id: towerId,
        team: "teamTwo",
        unit_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 1141 : 156, true),
        artifact_id: getRandomIntNearNumber(process.env.NODE_ENV === 'production' ? 751 : 1, false),
        speed: 0,
        health: 0,
        has_immunity: false,
        has_counter: false
    },
]

const seedDummy = async () => {
    // Set to a Guild (In case people test leaving the guild)
    const dummyUserId = process.env.NODE_ENV === 'production' ? 8 : 9;
    const dummyGuildId = process.env.NODE_ENV === 'production' ? 17 : 35;
    await db('users')
        .where({
            id: dummyUserId
        })
        .update({
            guild_id: dummyGuildId,
            username: "GWScouter"
        })

    // Reset guild role to admin
    const guildRole = await db('user_guild_roles')
                        .select('*')
                        .where({
                            user_id: dummyUserId
                        })
                        .first();
    // Insert new role record
    if(guildRole === undefined) {
        await db('user_guild_roles')
                .insert({
                    user_id: dummyUserId,
                    guild_id: dummyGuildId,
                    is_admin: true
                });
    } else {
        // Update existing record just in case something happened
        await db('user_guild_roles')
            .where({
                user_id: dummyUserId
            })
            .update({
                is_admin: true
            })
    }
    // Get Battle
    const battle = await db('battles')
                        .select('*')
                        .where({
                            guild_id: dummyGuildId
                        })
                        .first();
    const { id: battleId } = battle;

    // Clear existing battle data
    const towerIDsInDummyGuild = await db('towers')
                                .pluck('id')
                                .where({
                                    battle_id: battleId
                                });
    console.log(towerIDsInDummyGuild);

    await Promise.all(towerIDsInDummyGuild.map(async towerId => {
        await db.raw(`DELETE FROM public.tower_history WHERE tower_id=${towerId};`);
        await db.raw(`DELETE FROM public.enemy_units WHERE tower_id=${towerId};`);

    }));
    
    await db.raw(`DELETE FROM public.towers WHERE battle_id=${battleId};`);
    // Towers
    await Promise.all(dummyTowers(battleId).map(async tower => {
        const towerId = await db('towers')
                            .returning('id')
                            .insert(tower);

        // await Promise.all()
        dummyEnemyUnits(parseInt(towerId)).map(async enemyUnit => {
            await db('enemy_units')
                .insert(enemyUnit);
        })
    }));    
}

module.exports = {
    seedDummy
}