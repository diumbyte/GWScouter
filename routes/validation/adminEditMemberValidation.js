const { body, param, validationResult } = require('express-validator');

const adminHandler = [
    body('newIsAdmin')
        .isBoolean(),
    body('guildId')
        .isInt({min: 0}),
    param('userId')
        .isInt({min: 0})
];

const checkValidAdmin = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    adminHandler,
    checkValidAdmin
]