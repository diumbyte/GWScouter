const requireLogin = require('../middlewares/requireLogin');
const requireGuild = require('../middlewares/requireGuild');
const requireGuildAdmin = require('../middlewares/requireGuildAdmin');

const db = require('../db');

module.exports = (app) => {
    app.get('/api/battle', requireGuild, async (req, res) => {

    });
}
