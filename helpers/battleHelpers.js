const updatedUnitProperties = (origEnemyUnit, updatedEnemyUnit, userId) => {
    const differences = Object.keys(origEnemyUnit)
    .filter(k => origEnemyUnit[k] !== updatedEnemyUnit[k]);

    const changesHistory = differences.map(prop => {
        let message = '';
        switch (prop) {
            case 'unit_id':
                message = `Changed unit to ${updatedEnemyUnit.heroName}`
                break;
            case 'artifact_id':
                message = `Changed artifact to ${updatedEnemyUnit.artifactName}`
                break;
            case 'speed':
                message = `Changed speed to ${updatedEnemyUnit.speed}`
                break;
            case 'health':
                message = `Changed health to ${updatedEnemyUnit.health}`
                break;
            case 'has_immunity':
                message = `Changed immunity to ${updatedEnemyUnit.has_immunity}`
                break;
            case 'has_counter':
                message = `Changed counter to ${updatedEnemyUnit.has_counter}`
                break;
        }

        return {
            tower_id: updatedEnemyUnit.tower_id,
            user_id: userId,
            action: message
        };
    });

    return changesHistory;
}

module.exports = {
    updatedUnitProperties
}