module.exports = (req, res, next) => {
    if(!req.user) {
        return res.status(200).send({error: "You must log in"});
    }

    next();
}