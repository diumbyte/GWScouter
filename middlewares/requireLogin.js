module.exports = (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({errors: [{msg: "You must be logged in."}]});
    }

    next();
}