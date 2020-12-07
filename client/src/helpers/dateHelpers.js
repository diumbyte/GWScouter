import { DateTime, Interval } from 'luxon';


const isAGuildWarDay = () => {
    const currentDayOfWeek = DateTime.utc().weekday;
    
    // 1 = Monday, 3 = Wednesday, 5 = Friday, Sunday = 7
    // ✓ Global: 10:00 UTC (starts and stops on the next day)
    return (currentDayOfWeek === 1 || currentDayOfWeek === 3 || currentDayOfWeek === 5 );
}

const startBattleSession = () => {
    if (!isAGuildWarDay()) {
        return null;
    }
    return DateTime.utc().set({hour: 10, minute: 0, second: 0});
}

const endBattleSession = (startBattleSession) => {
    if (!isAGuildWarDay()) {
        return null;
    }
    return startBattleSession.plus({hour: 23, minute: 59});
}

const isActiveBattleSession = () => {
    const currentDate = DateTime.utc();

    if (!isAGuildWarDay()) {
        return false;
    }
    const startBattleSession = DateTime.utc().set({hour: 10, minute: 0, second: 0});
    const endBattleSession = startBattleSession.plus({hour: 23, minute: 59});

    return Interval
            .fromDateTimes(startBattleSession, endBattleSession)
            .contains(currentDate);
}

const isTargetDayOfWeekInFuture = (targetDayOfWeek) => {
    const currentDate = DateTime.utc();
    const currentDayOfWeek = currentDate.weekday;

    if(currentDayOfWeek <= targetDayOfWeek) {
        return currentDate.set({weekday: targetDayOfWeek, hour: 10, minute: 0, second: 0});
    } 
    return false;
}

const nextTargetDayOfWeek = (daysOfWeekArray) => {
        // Monday = 1 = Start of week.
        const currentDate = DateTime.utc();
        const nextDaysInNeed = daysOfWeekArray;
    
        // Iterate and find all possible matches
        const targetDayChecks = nextDaysInNeed.map(isTargetDayOfWeekInFuture);
    
        // Select the first matching day of week. Ignore subsequent matches
        const thisWeek = targetDayChecks.find(check => check instanceof DateTime)
    
        // If there no matches => Return first valid entry of following week
        const nextWeek = currentDate.plus({week: 1}).set({weekday: nextDaysInNeed[0], hour: 10, minute: 0, second: 0});
        const nextTargetDay = thisWeek || nextWeek;

        return nextTargetDay;
}

export {
    isAGuildWarDay,
    startBattleSession,
    endBattleSession,
    isActiveBattleSession,
    nextTargetDayOfWeek
}