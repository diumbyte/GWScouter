module.exports = (req, res, next) => {
    if(!req.user.guild_id) {
        return res.status(401).send({error: "You must be in a guild"});
    }

    next();
}