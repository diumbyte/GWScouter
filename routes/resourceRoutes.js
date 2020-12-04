const router = require('express').Router();
const requireGuild = require('../middlewares/requireGuild');

const db = require('../db');

router.get('/api/hero', async (req, res) => {
    const heroesList = await db('heroes')
                        .select('*');

    res.status(200).json(heroesList);
});

router.get('/api/hero/:heroId', async (req, res) => {

});

router.get('/api/artifact', async (req, res) => {
    const artifactsList = await db('artifacts')
                            .select('*');

    res.status(200).json(artifactsList);
});

router.get('/api/artifact/:artifactId', async (req, res) => {
    
});

module.exports = router;
