const cron = require('node-cron');
const db = require('../db');
const { startBattleSession, endBattleSession } = require('../helpers/dateHelpers');



// 2,4,6 = Mon,Wed,Fri. At 10:00 UTC
// CRON 
// Update all battle current flags to false
cron.schedule('0 10 * * 2,4,6', async () => {
    console.log("Closing all current battles.")
    
    await db.raw(`UPDATE public.battles
        SET is_active=false;`);

    console.log("Battles closed.")
}, {timezone: "Etc/UTC"});

cron.schedule('0 10 * * 1,3,5', async () => {
    console.log("Retiring inactive battles");

    await db.raw(`UPDATE public.battles
    SET current_battle=false;`);

    console.log("Inactive battles retired");
    
    console.log("Creating new current battles for guilds");
    const guildIds = await db('guilds')
        .pluck('id');

    const startSession = startBattleSession();
    const endSession = endBattleSession(startSession);

    const battlesToInsert = guildIds.map(guildId => {
        return {
            guild_id: guildId,
            started_at: startSession.toJSDate(),
            ends_at: endSession.toJSDate(),
            current_battle: true,
            is_active: true
        }
    });

    await db('battles')
        .returning('*')
        .insert(battlesToInsert);

    console.log("Successfully created battles.");
    
}, {timezone: "Etc/UTC"});
