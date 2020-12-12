const router = require('express').Router();
const db = require('../db');
const { seedDummy } = require('../services/seedDummyAccount');

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

router.get('/api/dummy', async (req, res) => {
    seedDummy();
    res.json("Success");
});

module.exports = router;
