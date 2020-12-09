const { body, validationResult } = require('express-validator');

const newGuildHandler = [
    body('guildName')
        .isLength({min: 0})
        .matches(/^[a-z0-9 \-_\/]+$/i).withMessage("Guild name must only be alphanumeric characters")
];

const checkValidNewGuild = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    newGuildHandler,
    checkValidNewGuild
]