module.exports = (req, res, next) => {
    if(!req.user.guild_id) {
        return res.status(401).json({errors: [{msg: "You must be in a guild to do this"}]});
    }

    next();
}