const requireGuild = require('../middlewares/requireGuild');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/hero', async (req, res) => {
        const heroesList = await db('heroes')
                            .select('*');

        res.status(200).json(heroesList);
    });

    app.get('/api/hero/:heroId', async (req, res) => {

    });

    app.get('/api/artifact', async (req, res) => {
        const artifactsList = await db('artifacts')
                                .select('*');

        res.status(200).json(artifactsList);
    });

    app.get('/api/artifact/:artifactId', async (req, res) => {
        
    });
}
