const router = require('express').Router();
const { DateTime, Interval } = require('luxon');
const { startBattleSession, endBattleSession } = require('../helpers/dateHelpers');

const db = require('../db');

router.get('/api/hero', async (req, res) => {
    const heroesList = await db('heroes')
                        .select('*');

    res.status(200).json(heroesList);
});

router.get('/api/artifact', async (req, res) => {
    const artifactsList = await db('artifacts')
                            .select('*');

    res.status(200).json(artifactsList);
});

router.get('/api/date', async(req, res) => {
    // Monday = 1 = Start of week.
    const currentDate = DateTime.utc();
    const currentDayOfWeek = currentDate.weekday;
    const nextDayInNeed = 1;
    const nextDaysInNeed = [1,3,5];

    let beginning;

    // Next day is still within the same week.
    if(currentDayOfWeek <= nextDayInNeed) {
        beginning = currentDate.set({weekday: nextDayInNeed, hour: 10, minute: 0, second: 0});
    } else {
        // Look for the same day in the next week. 
        beginning = currentDate.plus({week: 1}).set({weekday: nextDayInNeed, hour: 10, minute: 0, second: 0});
    }

    res.json(beginning.toJSDate().toUTCString());
})

router.get('/api/test', async (req, res) => {
    const guildIds = await db('guilds')
        .pluck('id');

    const startSession = startBattleSession();
    const endSession = endBattleSession(startSession);

    const battlesToInsert = guildIds.map(guildId => {
        return {
            guild_id: guildId,
            started_at: startSession.toJSDate(),
            ends_at: endSession.toJSDate(),
            current_battle: true
        }
    });

    const newBattles = await db('battles')
                        .returning('*')
                        .insert(battlesToInsert);
    

    res.json(newBattles);
});

module.exports = router;
