const { body, validationResult } = require('express-validator');
const { names : zoneOpts} = require('../../db/models/constants/ZoneOptions')

const towerHandler = [
    body('username')
        .isLength({min: 1}).withMessage("Username must not be empty.")
        .matches(/^[a-z0-9 \-_\/]+$/i)
        .withMessage("Username must only be alphanumeric characters"),
    body('isStronghold')
        .isBoolean(),
    body('zone')
        .isIn(zoneOpts)
        .withMessage(`Zone must be one of the following: ${zoneOpts}`),
];

const checkValidTower = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    towerHandler,
    checkValidTower
]