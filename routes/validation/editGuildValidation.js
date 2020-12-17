const { body, validationResult } = require('express-validator');

const guildHandler = [
    body('guildName')
        .isLength({min: 1}).withMessage("Username must not be empty.")
        .matches(/^[a-z0-9 \-_\/]+$/i)
        .withMessage("Username must only be alphanumeric characters")
];

const checkValidGuild = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    guildHandler,
    checkValidGuild
]