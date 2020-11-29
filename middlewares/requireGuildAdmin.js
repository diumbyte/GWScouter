const db = require('../db');

module.exports = async (req, res, next) => {
    const {id : user_id, guild_id} = req.user;
    
    const isGuildAdmin = await db('user_guild_roles')
        .select('is_admin')
        .where({
            user_id,
            guild_id
        })
        .first();
        
    if(!isGuildAdmin) {
        return res.status(401).send({error: "You are not authorized to do this"});
    }

    next();
}