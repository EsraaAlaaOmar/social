const express = require('express');
const router = express.Router();
const auth = require('../../mildware/auth')
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {
    check,
    validationResult
} = require('express-validator')

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        console.log(user)
        res.json(user)
    } catch (error) {
        console.log(error)
        res.status(500).send('server error')
    }
}),






    router.post('/', [

        check('email', 'please include a valid email').isEmail(),
        check('password', 'please enter a password with 6 or more chracters'
        ).exists()
    ], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body;

        try {

            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'user already exist' }] })

            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: 'invalid credidantial' }] })
            }
            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(payload, config.get('JwtSecret'), { expiresIn: 36000 }, (error, token) => {
                if (error) throw error
                res.json({ token })
            })
            //  res.send('user registered')
        } catch (error) {
            console.error(error.message)
            res.status(500).send('server error')
        }

    })
module.exports = router;
