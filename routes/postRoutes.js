let router = require('express').Router();
var postController = require('../controllers/postController');
let jwt = require('jsonwebtoken')


Post = require('../models/postModel')

router.post('/', postController.addPost)
router.get('/', postController.getPosts)
router.get('/:id', postController.getPostById)
router.patch('/:id', checkUser, postController.updatePost)
router.delete('/:id', checkUser, postController.deletePost)


/**
 * @swagger
 * /post:
 *   post:
 *     summary: Add posts
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: the list of the posts
 */


/**
 * @swagger
 * /post:
 *   get:
 *     summary: Returns all posts
 *     responses:
 *       200:
 *         description: the list of the posts
 */

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Returns the post by id and the user who created the post
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of the post 
 *     responses:
 *       200:
 *         description: post by Id
 */

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Deletes the post by id
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID of the post 
 *     responses:
 *       200:
 *         description: post by Id
 */


/**
 * @swagger
 * /post/{id}:
 *   patch:
 *     summary: Updates the post by id
 *     requestBody:
 *         content:
 *             application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       200:
 *         description: post by Id
 */

function checkUser(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    const decodedToken = jwt.decode(token, {
        complete: true
    });

    const userId = decodedToken.payload.id

    Post.find({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            return res.send(err)
        }
        else {

            if (data[0] == null) {
                res.send({
                    "message": "Post not found with this postId"
                })
            }
            else {

                if (data[0].userId == userId) {
                    next()
                }

                else {
                    res.json({
                        "message": "Post can only be updated or deleted by user who created it"
                    })
                }
            }
        }
    })
}

module.exports = router