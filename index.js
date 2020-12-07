const express = require('express');
const app = express();
const keys = require('./config/keys');
const passport = require('passport');
const cookieSession = require('cookie-session');
const sslRedirect = require('heroku-ssl-redirect').default;

app.disable('x-powered-by');
require('./services/passport');
require('./services/battleScheduler');


app.use(express.urlencoded({extended: true})); 
app.use(express.json());   
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize());
app.use(passport.session());
app.use(sslRedirect());

// Router
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/battleRoutes'));
app.use('/', require('./routes/resourceRoutes'));
app.use('/', require('./routes/guildRoutes'));


if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets like our main.js/css file
    app.use(express.static('./client/build'));
    // Express will serve up index.html if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}



const PORT = process.env.PORT || 5000;
app.listen(PORT);