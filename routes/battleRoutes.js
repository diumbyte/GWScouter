const router = require('express').Router();
const requireGuild = require('../middlewares/requireGuild');
const requireLogin = require('../middlewares/requireLogin');
const { updatedUnitProperties, arrayHasDuplicates } = require('../helpers/battleHelpers');
const towerValidation = require('./validation/towerValidation');
const enemyUnitValidation = require('./validation/enemyUnitValidation');
const editTowerValidation = require('./validation/editTowerValidation');

const { startBattleSession, endBattleSession } = require('../helpers/dateHelpers');

const db = require('../db');

router.get('/api/battle/time', requireLogin, requireGuild, async (req, res) => {
    const battleInfo = await db('battles')
                        .select('*')
                        .where({
                            guild_id: req.user.guild_id,
                            current_battle: true
                        })
                        .first();

    if(battleInfo === undefined) {
        return res.json({
            current_battle: false,
            is_active: false,
            ends_at: 0
        })
    }
    res.json(battleInfo);
});

router.get('/api/battle', requireLogin, requireGuild, async (req, res) => {
    
    // Get current battle
    const currentBattleId = await db('battles')
                        .pluck('id')
                        .where({
                            guild_id: req.user.guild_id,
                            current_battle: true
                        });
                        
    if(currentBattleId.length === 0) {
        return res.status(422).json({errors: [{msg: "No active battle."}]})
    }

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
    
    res.status(200).json(towersWithUnits);
});

router.post(
    '/api/battle/tower', 
    requireLogin, 
    requireGuild, 
    towerValidation,
    async (req, res) => {
    const { 
        username,
        isStronghold,
        zone,
        unitA,
        unitB,
        unitC,
        unitD,
        unitE,
        unitF,
    } = req.body;

    const submittedUnits = [unitA,unitB,unitC,unitD,unitE,unitF];

    if(arrayHasDuplicates(submittedUnits)) {
        return res.status(400).json({errors: [{msg: "Unit can only appear once in a tower."}]})
    }



    const currentBattleId = await db('battles')
                            .pluck('id')
                            .where({
                                guild_id: req.user.guild_id,
                                current_battle: true
                            });

    // Have to check if a stronghold already exists in the zone
    const strongholdInZone = await db('towers')
                        .select('*')
                        .where({
                            zone,
                            is_stronghold: true,
                            battle_id: currentBattleId[0]
                        });
                        
    if(isStronghold && strongholdInZone.length !== 0) {
        return res.status(400).json({errors: [{msg: `Stronghold already exists in ${zone} zone.`}]});
    }

                          
    // console.log("currentBattleId");
    // console.log(currentBattleId);
    // Create Tower
    const newTowerId = await db('towers')
                .returning('id')
                .insert({
                    battle_id: currentBattleId[0],
                    enemy_username: username,
                    is_stronghold: isStronghold,
                    zone
                });

    // console.log("newTowerId");
    // console.log(newTowerId);
    // Update Tower History
    await db('tower_history')
                .insert({
                    tower_id: newTowerId[0].id,
                    user_id: req.user.id,
                    action: `Created tower`
                })

    const unknownArtifact = await db('artifacts')
                        .pluck('id')
                        .where({
                            name: "Unknown"
                        });
    const unknownArtifactId = unknownArtifact[0];
    // Create Enemy Unit Entries
    const enemyUnits = submittedUnits.map(unit => {
        // When artifact_id = 0 => Unknown which has id 1 in db
        const artifact_id = unit.artifactId === 0 
                        ? unknownArtifactId 
                        : unit.artifactId;
        
        return {
            tower_id: newTowerId[0].id,
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

router.post(
    '/api/battle/unit/:unitId', 
    requireLogin, 
    requireGuild, 
    enemyUnitValidation,
    async (req, res) => {
    const { unitId } = req.params;
    const {
        heroId,
        artifactId,
        speed,
        health,
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
    

    const differences = updatedUnitProperties(origEnemyUnit, updatedEnemyUnit, req.user.id);

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

router.get('/api/tower/:towerId', requireLogin, requireGuild, async (req, res) => {
    const { towerId } = req.params;

    const tower = await db('towers')
                    .select('*')
                    .where({
                        id: towerId
                    }).first();

    return res.status(200).json(tower);
});

router.post('/api/tower/:towerId', requireLogin, requireGuild, editTowerValidation, async (req, res) => {
    const { towerId } = req.params;
    const { isStronghold, username, zone } = req.body;

    const currentBattleId = await db('battles')
    .pluck('id')
    .where({
        guild_id: req.user.guild_id,
        current_battle: true
    });

    // Have to check if a stronghold already exists in the zone
    const strongholdInZone = await db('towers')
                                .select('*')
                                .where({
                                    zone,
                                    is_stronghold: true,
                                    battle_id: currentBattleId[0]
                                })
                                .first();
                                
    if(isStronghold && strongholdInZone.length !== 0 && strongholdInZone.id != towerId) {
        return res.status(400).json({errors: [{msg: `Stronghold already exists in ${zone} zone.`}]});
    }

    await db('towers')
            .where({
                id: towerId
            })
            .update({
                enemy_username: username,
                is_stronghold: isStronghold
            })
    
    res.json("Success");
});

router.delete("/api/tower/:towerId", requireLogin, requireGuild, async (req, res) => {
    const { towerId } = req.params;

    // Delete tables that have a FK to towers first
    await db('tower_history')
        .where({
            tower_id: towerId
        })
        .del();

    await db('enemy_units')
        .where({
            tower_id: towerId
        })
        .del();
    
    await db('towers')
        .where({
            id: towerId
        })
        .del();
    
    res.json("Success");
})

module.exports = router;
