const router = require('express').Router();
const db = require('../db');

router.get('/api/hero', async (req, res) => {
    const heroesList = await db('heroes')
                        .select('*');

    res.status(200).json(heroesList);
});

router.get('/api/artifact', async (req, res) => {
    const artifactsList = await db('artifacts')
                            .select('*');

    res.status(200).json(artifactsList);
});

module.exports = router;
