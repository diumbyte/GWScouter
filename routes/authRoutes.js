const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/discord', passport.authenticate('discord'));
    
    app.get('/auth/discord/callback', passport.authenticate('discord'));

    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.send(req.user);
    });

    app.get('/auth/current_user', (req, res) => {
        res.send(req.user);
    });
}
