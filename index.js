const express = require('express');
const app = express();
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
require('./services/passport');


app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
)
app.use(passport.initialize());
app.use(passport.session());

app.disable('x-powered-by');
require('./routes/authRoutes')(app);



const PORT = process.env.PORT || 5000;
app.listen(PORT);