const requireGuild = require('../middlewares/requireGuild');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/battle', requireGuild, async (req, res) => {

    });

    app.post('/api/battle/tower', requireGuild, async (req, res) => {
        const { 
            username,
            zone,
            unitA,
            unitB,
            unitC,
            unitD,
            unitE,
            unitF,
        } = req.body;

        console.log(username, zone, unitE);

        res.json("Yay");
    });
}
