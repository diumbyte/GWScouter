const requireGuild = require('../middlewares/requireGuild');
const requireLogin = require('../middlewares/requireLogin');
const { TeamOne, TeamTwo } = require('../db/models/constants/TeamOptions');
const { Top, Mid, Bot, Main } = require('../db/models/constants/ZoneOptions');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/battle', requireLogin, requireGuild, async (req, res) => {
        
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
                ...tower,
                teamOne,
                teamTwo
            };
        }));
        
        // console.log(towersWithUnits[0]);
        
        res.status(200).json(towersWithUnits);
    });

    app.post('/api/battle/tower', requireLogin, requireGuild, async (req, res) => {
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
                        action: `${req.user.username} created entry`
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
}
