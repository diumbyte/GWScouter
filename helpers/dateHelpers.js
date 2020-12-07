const { DateTime, Interval } = require('luxon');


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

module.exports = {
    isAGuildWarDay,
    startBattleSession,
    endBattleSession,
    isActiveBattleSession
}