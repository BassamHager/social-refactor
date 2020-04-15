const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [check('name', 'name is required').not().isEmpty(), check('email', 'insert a valid email').normalizeEmail().isEmail(), check('password', 'please insert 6 characters min for password').isLength({ min: 6 })], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    res.send('users route')
})

module.exports = router;