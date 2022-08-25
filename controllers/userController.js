User = require("../models/userModel")
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken');
let helper = require('../utils/helper')
let nodemailer = require('nodemailer')


function sendEmail(){
    let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:"fa18-bcs-080@cuiatk.edu.pk",
            pass:"Talhiandroid5"
        }
    })

    let mailOptions  = {
        from: "fa18-bcs-080@cuiatk.edu.pk",
        to: "tzubair417@gmail.com",
        subject : "Welcome to Our Site",
        text: "You are registered successfully"
    }

    transporter.sendMail(mailOptions,function(err,data){
        if(err){
            console.log(err)
        }
        else{
            console.log("Email sent :" + data.response)
        }
    })
}

exports.register = function (req, res) {
    var user = new User()

    if (helper(req.body.email)) {


        if (req.body.firstName == '') {
            res.json({
                message: "FirstName cannot be empty"
            })
        }

        else if (req.body.lastName == '') {
            res.json({
                message: "FirstName cannot be empty"
            })
        }

        else if (req.body.password.length < 6) {
            res.json({
                message: "Password should be more than 6 characters"
            })
        }
        else {
            user.firstName = req.body.firstName
            user.lastName = req.body.lastName
            user.email = req.body.email
            user.password = bcrypt.hashSync(req.body.password, 10)

            User.find({ email: req.body.email }, function (err, data) {
                if (err) throw err

                else if (data != '') {

                    res.json({
                        message: "User is already Registered"
                    })
                }
                else {
                    user.save(function (err) {
                        if (err) {
                            throw err
                        }
                        else{
                            sendEmail()
                            res.json({
                                message: "User Registered",
                                data: user
                            })
                        }
                        
                    })
                }
            })
        }
    }
    else {
        res.json({
            "message": "Email is not valid"
        })
    }

}


exports.loginUser = function (req, res) {

    if (helper(req.body.email)) {
        if (req.body.password == '') {
            res.json({
                message : "Password Field cannot be empty"
            })
        }
        else {
            User.find({ email: req.body.email }, async function (err, data) {
                if (err) {
                    console.log(err);
                }
                else {

                    const password_valid = await bcrypt.compare(req.body.password, data[0].password);
                    if (password_valid) {

                        const token = jwt.sign({ "id": data[0]._id }, process.env.SECRET, { expiresIn: '1800s' });
                        res.status(200).json({ token: token });

                    }
                    else {
                        res.json({
                            message: "Password does not match"
                        });
                    }
                }
            });
        }
    }

    else{
        res.json({
            message :"Email is not valid"
        })
    }
}