var mongoose = require('mongoose')


var postSchema = mongoose.Schema({

    title : {
        type: String,
        required:true
    },

    description:{
        type: String,
        required : true
    },

    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
},{ timestamps: true })

var Post = module.exports = mongoose.model('post',postSchema)
