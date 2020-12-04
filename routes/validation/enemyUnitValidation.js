const { body, validationResult } = require('express-validator');

const unitHandler = [
    body('heroId')
        .isInt({min: 0})
        .withMessage("A valid unit must be selected"),
    body('artifactId')
        .isInt({min: 0})
        .withMessage("A valid artifact must be selected"),
    body('speed')
        .isInt({min: 0})
        .withMessage("Speed must be 0 or positive."),
    body('health')
        .isInt({min: 0})
        .withMessage("Health must be 0 or positive."),
    body('hasImmunity')
        .isBoolean()
        .withMessage("Immunity must be true or false"),
    body('hasCounter')
        .isBoolean()
        .withMessage("Counter must be true or false")
];

const checkValidUnit = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    unitHandler,
    checkValidUnit
]