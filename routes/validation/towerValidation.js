const { body, validationResult } = require('express-validator');
const { names : teamOpts} = require('../../db/models/constants/TeamOptions');
const { names : zoneOpts} = require('../../db/models/constants/ZoneOptions')

const unitPropChecker = (prop) => {
    return ['unitA','unitB','unitC',
    'unitD','unitE','unitF',].map(unit => {
        return `${unit}.${prop}`
    });
}

const towerHandler = [
    body('username')
        .isLength({min: 1}).withMessage("Username must not be empty.")
        .matches(/^[a-z0-9 ]+$/i)
        .withMessage("Username must only be alphanumeric characters"),
    body('isStronghold')
        .isBoolean(),
    body('zone')
        .isIn(zoneOpts)
        .withMessage(`Zone must be one of the following: ${teamOpts}`),
    body(unitPropChecker('team'))
        .isIn(teamOpts)
        .withMessage(`Team must be one of the following: ${teamOpts}`),
    body(unitPropChecker('unitId'))
        .isInt({min: 1})
        .withMessage("Units names are required."),
    body(unitPropChecker('artifactId'))
        .isInt({min: 0}),
    body(unitPropChecker('speed'))
        .isInt({min: 0}),
    body(unitPropChecker('health'))
        .isInt({min: 0}),
    body(unitPropChecker('hasImmunity'))
        .isBoolean(),
    body(unitPropChecker('hasCounter'))
        .isBoolean()
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