const passport = require('passport');

module.exports = (app) => {
    app.get('/auth/discord', passport.authenticate('discord'));
    
    app.get('/auth/discord/callback', passport.authenticate('discord'), (req, res) => {
        res.redirect('/Battle');
    });

    app.get('/auth/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/auth/current_user', (req, res) => {
        res.send(req.user);
    });
}
