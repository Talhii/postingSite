let express = require('express')
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let app = express();
let dotenv = require('dotenv');
let jwt = require('jsonwebtoken')

let swaggerJsDoc = require('swagger-jsdoc')
let swaggerUI = require('swagger-ui-express')


dotenv.config();





function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET, (err, user) => {


        if (err) return res.send(err)

        req.user = user

        next()
    })
}



let userRoutes = require("./routes/userRoutes")
let postRoutes = require("./routes/postRoutes")

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }))

app.use('/user', userRoutes)
app.use('/post' ,postRoutes)



const swaggerOptions = {
    swaggerDefinition :{
        openapi: "3.0.0",
        info:{
            title : "Post App",
            version : "1.0.0",
            description : "A simple express api"
        },
        components: {
            securitySchemes: {
              jwt: {
                type: "http",
                scheme: "bearer",
                in: "header",
                bearerFormat: "JWT"
              },
            }
          }
          ,
          security: [{
            jwt: []
          }],
        servers:[
            {
                url:"http://localhost:8080"
            }
        ]
    },
    apis:['./routes/postRoutes.js','./routes/userRoutes.js']
}


//connect to mongoose
const dbPath = 'mongodb://localhost/firstrest';
const options = { useNewUrlParser: true, useUnifiedTopology: true }
const mongo = mongoose.connect(dbPath, options);
mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
})

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs))

var port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Welcome to Express'));
app.listen(port, function () {
    console.log("Running FirstRest on Port " + port);
})


