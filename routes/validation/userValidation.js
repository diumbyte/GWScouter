const { body, validationResult } = require('express-validator');

// userSchema = {
//     id : Number,
//     username: String,
//     discord_id: String,
//     guild_id: Number
// }

const userHandler = [
    body('username')
        .isAlphanumeric().withMessage("Username can only contain alphanumeric characters.")
        .isLength({min: 1, max: 40}).withMessage("Usernames must be 1-40 alphanumeric characters.")
];

const checkValidUser = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}

// If exported as an object, would have to require in both properties in route handlers/controllers
// Exporting as array = Require in just one file and both get run in sequence
module.exports = [
    userHandler,
    checkValidUser
]