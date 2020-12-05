const updatedUnitProperties = (origEnemyUnit, updatedEnemyUnit, userId) => {
    const differences = Object.keys(origEnemyUnit)
    .filter(k => origEnemyUnit[k] !== updatedEnemyUnit[k]);

    const changesHistory = differences.map(prop => {
        let message = '';
        switch (prop) {
            case 'unit_id':
                message = `Changed ${origEnemyUnit.heroName} to ${updatedEnemyUnit.heroName}`
                break;
            case 'artifact_id':
                message = `Changed ${origEnemyUnit.heroName}'s artifact to ${updatedEnemyUnit.artifactName}`
                break;
            case 'speed':
                message = `Changed ${origEnemyUnit.heroName}'s speed to ${updatedEnemyUnit.speed}`
                break;
            case 'health':
                message = `Changed ${origEnemyUnit.heroName}'s health to ${updatedEnemyUnit.health}`
                break;
            case 'has_immunity':
                message = `Changed ${origEnemyUnit.heroName}'s immunity to ${updatedEnemyUnit.has_immunity}`
                break;
            case 'has_counter':
                message = `Changed ${origEnemyUnit.heroName}'s counter to ${updatedEnemyUnit.has_counter}`
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

const arrayHasDuplicates = (array) => {
    return array
            .map(item => item.unitId)
            .some((item, idx, arr) => arr.indexOf(item) !== idx)
}

module.exports = {
    updatedUnitProperties,
    arrayHasDuplicates
}