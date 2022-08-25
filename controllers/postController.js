Post = require("../models/postModel")
User = require("../models/userModel")
let jwt = require("jsonwebtoken")


exports.addPost = function (req, res) {

    var post = new Post()


    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    const decodedToken = jwt.decode(token, {
        complete: true
    });

    const userId = decodedToken.payload.id

    post.title = req.body.title
    post.description = req.body.description
    post.userId = userId

    post.save(function (err) {
        if (err) {
            res.json({
                message: "User Id is not correct",
            })
        }
        else {

            res.json({
                message: "Post added Successfully",
                data: post
            })
        }
    })
}


exports.updatePost = function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(function (post) {

        if (!post) {
            return res.status(404).send();
        }
        res.send(post);

    }).catch(function (error) {
        res.status(500).send(error);
    })

}

exports.deletePost = function (req, res) {
    Post.deleteOne({
        _id: req.params.id
    }, function (err) {
        if (err){
            res.json({
                "message": "Post not found with this Id"
            })
        }
        else {
            res.json({
                status: "success",
                message: 'Post Deleted'
            })
        }
    })
}

exports.getPosts = function (req, res) {


    var page = req.query.page || 1

    if (typeof req.query.userId !== 'undefined') {


        Post.find({
            userId: req.query.userId
        }, function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(data)
            }
        }).skip(page > 1 ? (page - 1) * 2 : 0).limit(2)
    }

    else {
        Post.find({
            $and: [{ createdAt: { $lte: req.query.endDate } }, { createdAt: { $gte: req.query.startDate } }]
        }, function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                res.send(data)
            }
        }).skip(page > 1 ? (page - 1) * 2 : 0).limit(2)
    }
}

exports.getPostById = function (req, res) {

    Post.find({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            res.send(err)
        }
        else {

            if (data[0] == null) {
                res.json({
                    message: "Post does not exist with this id"
                })
            }
            else {
                User.find({
                    _id: data[0].userId
                }, function (err, userData) {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.json({
                            post: data[0],
                            user: {
                                _id: userData[0]._id,
                                firstName: userData[0].firstName,
                                lastName: userData[0].lastName,
                                email: userData[0].email
                            }
                        })
                    }
                })

            }
        }
    })
}