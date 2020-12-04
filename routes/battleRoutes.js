const router = require('express').Router();
const requireGuild = require('../middlewares/requireGuild');
const requireLogin = require('../middlewares/requireLogin');
const { updatedUnitProperties } = require('../helpers/battleHelpers');

const db = require('../db');

router.get('/api/battle', requireLogin, requireGuild, async (req, res) => {
    
    // Get current battle
    const currentBattleId = await db('battles')
                        .pluck('id')
                        .where({
                            guild_id: req.user.guild_id,
                            current_battle: true
                        });

    const towers = await db('towers')
                        .select('*')
                        .where({
                            battle_id: currentBattleId[0]
                        })

    const towersWithUnits = await Promise.all(towers.map(async tower => {
        const enemyUnits = await db('enemy_units')
                            .select(
                                'enemy_units.*', 
                                'heroes.code as heroCode',
                                'heroes.name as heroName',
                                'artifacts.code as artifactCode',
                                'artifacts.name as artifactName'
                                )
                            .leftJoin('heroes', 'enemy_units.unit_id', 'heroes.id')
                            .leftJoin('artifacts', 'enemy_units.artifact_id', 'artifacts.id')
                            .where('enemy_units.tower_id', '=', tower.id);

        const enemyUnitsData = enemyUnits.map(unit => {
            return {
                id: unit.id,
                team: unit.team,
                unitId: unit.unit_id,
                unitCode: unit.heroCode,
                name: unit.heroName,
                speed: unit.speed,
                health: unit.health,
                artifact: unit.artifactName,
                artifactCode: unit.artifactCode,
                hasImmunity: unit.has_immunity,
                hasCounter: unit.has_counter
            }
        });
        
        const teamOne = enemyUnitsData.filter(unit => unit.team === "teamOne");
        const teamTwo = enemyUnitsData.filter(unit => unit.team === "teamTwo");

        return {
            username: tower.enemy_username,
            towerId: tower.id,
            isStronghold: tower.is_stronghold,
            ...tower,
            teamOne,
            teamTwo
        };
    }));
    
    // console.log(towersWithUnits[0]);
    
    res.status(200).json(towersWithUnits);
});

router.post('/api/battle/tower', requireLogin, requireGuild, async (req, res) => {
    const { 
        username,
        zone,
        unitA,
        unitB,
        unitC,
        unitD,
        unitE,
        unitF,
        isStronghold
    } = req.body;

    const currentBattleId = await db('battles')
                            .pluck('id')
                            .where({
                                guild_id: req.user.guild_id,
                                current_battle: true
                            });
    
                            
    // Create Tower
    const newTowerId = await db('towers')
                .returning('id')
                .insert({
                    battle_id: currentBattleId[0],
                    enemy_username: username,
                    is_stronghold: isStronghold,
                    zone
                });

    // Update Tower History
    await db('tower_history')
                .insert({
                    tower_id: newTowerId[0],
                    user_id: req.user.id,
                    action: `Created tower`
                })

    
    // Create Enemy Unit Entries
    const enemyUnits = [unitA,unitB,unitC,unitD,unitE,unitF].map(unit => {
        // When artifact_id = 0 => Unknown which has id 1 in db
        const artifact_id = unit.artifactId === 0 ? 1 : unit.artifactId ;
        
        return {
            tower_id: newTowerId[0],
            team: unit.team,
            unit_id: unit.unitId,
            artifact_id,
            speed: unit.speed,
            health: unit.health,
            has_immunity: unit.hasImmunity,
            has_counter: unit.hasCounter
        }
    });

    await db('enemy_units')
            .insert(enemyUnits);

    res.status(200).json("Success");
});

router.get('/api/battle/unit/:unitId', async (req, res) => {
    const { unitId } = req.params;

    const enemyUnit = await db('enemy_units')
    .select(
        'enemy_units.*', 
        'heroes.id as heroId',
        'heroes.code as heroCode',
        'heroes.name as heroName',
        'artifacts.id as artifactId',
        'artifacts.code as artifactCode',
        'artifacts.name as artifactName',
        'towers.enemy_username as username'
        )
    .leftJoin('heroes', 'enemy_units.unit_id', 'heroes.id')
    .leftJoin('artifacts', 'enemy_units.artifact_id', 'artifacts.id')
    .leftJoin('towers', 'enemy_units.tower_id', 'towers.id')
    .where('enemy_units.id', '=', unitId)
    .first();

    res.json(enemyUnit);
});

router.post('/api/battle/unit/:unitId', requireLogin, requireGuild, async (req, res) => {
    const { unitId } = req.params;
    const {
        heroId,
        speed,
        health,
        artifactId,
        hasImmunity,
        hasCounter
    } = req.body;

    const origEnemyUnit = await db('enemy_units')
                    .select(
                        'enemy_units.*', 
                        'heroes.name as heroName',
                        'artifacts.name as artifactName',
                        )
                    .leftJoin('heroes', 'enemy_units.unit_id', 'heroes.id')
                    .leftJoin('artifacts', 'enemy_units.artifact_id', 'artifacts.id')
                    .where('enemy_units.id', '=', unitId)
                    .first();
    
    // There's no way to return data from a joined table knex update so we'll separate the queries
    await db('enemy_units')
            .where('enemy_units.id', '=', unitId)
            .update({
                unit_id: heroId,
                artifact_id: artifactId,
                speed,
                health,
                has_immunity: hasImmunity,
                has_counter: hasCounter
            });
    
    const updatedEnemyUnit = await db('enemy_units')
                    .select(
                        'enemy_units.*', 
                        'heroes.name as heroName',
                        'artifacts.name as artifactName',
                        )
                    .leftJoin('heroes', 'enemy_units.unit_id', 'heroes.id')
                    .leftJoin('artifacts', 'enemy_units.artifact_id', 'artifacts.id')
                    .where('enemy_units.id', '=', unitId)
                    .first();
    

    // const updatedEnemyUnit = updatedEnemyUnitRes[0];

    const differences = updatedUnitProperties(origEnemyUnit, updatedEnemyUnit, req.user.id);

    console.log(differences);
    
    await db('tower_history')
            .insert(differences);
    
    res.json("Success");
});

router.get('/api/tower/history/:towerId', requireLogin, requireGuild, async (req, res) => {
    const { towerId } = req.params;

    const towerHistory = await db('tower_history')
                                .select('tower_history.*', 'users.username')
                                .leftJoin('users', 'tower_history.user_id', 'users.id')
                                .where('tower_history.tower_id', '=', towerId);
    
    res.status(200).json(towerHistory);
});

module.exports = router;
