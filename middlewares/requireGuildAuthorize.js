const db = require('../db');

module.exports = async (req, res, next) => {
    const { guild_id } = req.body;

    if (req.user.guild_id !== guild_id) {
        return res.status(401).send({error: "Unauthorized request"});
    }

    next()
}