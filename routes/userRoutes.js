let router = require('express').Router();
var userController = require('../controllers/userController');


router.route('/register').post(userController.register)
router.route('/login').post(userController.loginUser)



/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register User
 *     description: User
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *     responses:
 *       200:
 *         description: 
 */



/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login User
 *     description: User
 *     requestBody:
 *         required: true
 *         content:
 *             application/json:
 *                 schema:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     password:
 *                       type: string
 *     responses:
 *       200:
 *         description: 
 */
module.exports = router;