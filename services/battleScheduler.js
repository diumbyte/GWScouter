const cron = require('node-cron');
const db = require('../db');
const { startBattleSession, endBattleSession } = require('../helpers/dateHelpers');

// 2,4,6 = Mon,Wed,Fri. At 10:00 UTC
// Update all battle current flags to false
cron.schedule('0 10 * * Tuesday,Thursday,Saturday', async () => {
    console.log("Closing all current battles.")
    
    await db.raw(`UPDATE public.battles
        SET is_active=false;`);

    console.log("Battles closed.")
}, {timezone: "Etc/UTC"});

cron.schedule('0 10 * * Monday,Wednesday,Friday', async () => {
    // Trx: If function returns successfully then trx.commit() is implicitly called.
    // If an error is thrown by any of the funcs then trx.rollback() is implicitly called.
    await db.transaction(async trx => {
        console.log("Retiring inactive battles");

        await trx.raw(`DELETE FROM public.tower_history;`);
        await trx.raw(`DELETE FROM public.enemy_units;`);
        await trx.raw(`DELETE FROM public.towers;`);
        await trx.raw(`DELETE FROM public.battles;`);
    
        console.log("Inactive battles retired");

        console.log("Creating new current battles for guilds");
        const guildIds = await trx('guilds')
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
    
        await trx('battles')
            .returning('id')
            .insert(battlesToInsert);

        console.log("Successfully created battles."); 
    });
    
    
}, {timezone: "Etc/UTC"});
