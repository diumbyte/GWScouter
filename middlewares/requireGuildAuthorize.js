const db = require('../db');

module.exports = async (req, res, next) => {
    const { guild_id } = req.body;

    if (req.user.guild_id !== guild_id) {
        return res.status(401).json({errors: [{msg: "You must be in a guild."}]});
    }

    next()
}