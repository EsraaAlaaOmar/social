const express = require('express');
const router = express.Router();
const auth = require('../../mildware/auth')
const Post = require('../../models/posts')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

const {
    check,
    validationResult
} = require('express-validator')


router.post('/', [auth,
    check('text', 'Text is required').not().isEmpty(),

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            })
            const post = await newPost.save()
            res.send(post)
        } catch (e) {
            console.error(e)
            res.status(500).send('server error')
        }
    }
)
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.send(posts)

    } catch (e) {
        console.error(e)
        res.status(500).send('server error')
    }
})
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })

        }
        res.send(post)

    } catch (e) {
        console.error(e)
        if (e.kind === 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('server error')

    }
})
router.delete('/:id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' })

        }
        if (post.user.toString() !== req.user.id) {

            return res.status(401).json({ msg: 'User not authorized' })

        }
        await post.remove()
        res.json({ msg: 'Post removed' })

    } catch (e) {
        console.error(e)
        if (e.kind === 'ObjectId') {
            res.status(404).json({ msg: 'Post not found' })
        }
        res.status(500).send('server error')

    }
})
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' })
        }

        post.likes.unshift({ user: req.user.id })
        await post.save()
        res.json(post.likes)
    } catch (e) {
        console.error(e)
        res.status(500).send('server error')
    }
})
//unlike
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' })
        }
        // get temove index 
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
        post.likes.splice(removeIndex)

        await post.save()
        res.json(post.likes)
    } catch (e) {
        console.error(e)
        res.status(500).send('server error')
    }
})

router.post('/comment/:id', [auth,
    check('text', 'Text is required').not().isEmpty(),

],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        try {
            const user = await User.findById(req.user.id).select('-password')
            const post = await Post.findById(req.params.id)
            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }
            post.comments.unshift(newComment)
            post.save()
            console.log(post)
            res.send(post.comments)
        } catch (e) {
            console.error(e)
            res.status(500).send('server error')
        }
    }
)
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        //pull out comment
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        )
        //make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'comment dosent exist' })
        }
        //check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' })
        }
        // get remove index 
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
        post.comments.splice(removeIndex, 1)

        await post.save()
        console.log(post)

        res.json(post.comments)

    } catch (e) {
        console.error(e)
        res.status(500).send('server error')
    }
})
module.exports = router;
