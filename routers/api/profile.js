const express = require('express');
const router = express.Router();
const auth = require('../../mildware/auth')
const Profile = require('../../models/Profile')

const User = require('../../models/User')
const Post= require('../../models/posts')

const {
    check,
    validationResult
} = require('express-validator')

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile)

    } catch (e) {
        console.error(e.message)
        res.status(500).send('Server Error')
    }
})

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
        if (!profile) {
            return res.status(400).json({ msg: 'profile not found' })
        }
        res.json(profile)

    } catch (e) {
        console.error(e.message)
        if (e.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'profile not found' })
        }
        res.status(500).send('Server Error')
    }
})


router.post('/', [
    auth,
    [
        check('status', 'status is required').not().isEmpty(),
        check('skils', 'skils is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({ errors: errors.array() })

        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skils ,
            youtube,
            twitter,
            facebook,
            linkedin,
            instgram
        } = req.body
        //build profilr object 
        const profileField = {};
        profileField.user = req.user.id
        if (company) profileField.company = company
        if (website) profileField.website = website
        if (location) profileField.location = location
        if (bio) profileField.bio = bio
        if (status) profileField.status = status
        if (githubusername) profileField.githubusername = githubusername
        if (skils) {
            profileField.skils = (skils+'').split(',').map(skil => skil.trim())
        }
        //build social 
        profileField.social = {}
        if (youtube) profileField.social.youtube = youtube
        if (twitter) profileField.social.twitter = twitter
        if (facebook) profileField.social.facebook = facebook
        if (instgram) profileField.social.instgram = instgram
        if (linkedin) profileField.social.linkedin = linkedin
        console.log(profileField.social.twitter)
        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileField },
                    { new: true }
                )
                return res.json(profile)
            }
            profile = new Profile(profileField)

            await profile.save()
            res.send(profile)

        } catch (e) {
            console.error(e.message)
            res.status(500).send('server Error')
        }
    })
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.send(profiles)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('server Error')
    }
})
router.delete('/', auth, async (req, res) => {
    try {
        //Remove user posts
        await Post.deleteMany({ user: req.user.id})

        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })
        //remove user
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ message: 'user removed' })
    } catch (e) {
        console.error(e.message)
        res.status(500).send('server Error')
    }
})
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'company is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()

]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body
        const newExep = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.experience.unshift(newExep)
            await profile.save()
            res.json(profile)

        } catch (e) {
            console.error(e.message)
            res.status(500).send('server Error')
        }
    }
)
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)
        profile.experience.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('server Error')
    }
})

router.put('/education', [auth, [
    check('school', 'school is required').not().isEmpty(),
    check('degree', 'degree is required').not().isEmpty(),
    check('fieldofstudy', ' fieldofstudy is required').not().isEmpty(),
    check('from', 'from date is required').not().isEmpty()

]],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }
        try {
            const profile = await Profile.findOne({ user: req.user.id })
            profile.education.unshift(newEdu)
            await profile.save()
            res.json(profile)

        } catch (e) {
            console.error(e.message)
            res.status(500).send('server Error')
        }
    }
)
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        //get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)
        profile.education.splice(removeIndex, 1)
        await profile.save()
        res.json(profile)
    } catch (e) {
        console.error(e.message)
        res.status(500).send('server Error')
    }
})
module.exports = router;
