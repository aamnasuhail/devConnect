const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema.Types;
const userSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    email: {
        type : String,
        required : [true, "Email required"],
        unique : true,
        trim : true,
        validate : {
            validator : function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message : 'Please enter a valid email'
        }
    },
    password  : {
        type : String,
        required : true
    },
    resetToken : String,
    expireToken : Date,
    
    pic : {
        type : String,
        default : "https://res.cloudinary.com/kammy/image/upload/v1607202037/default-user-image-2_pputze.png"
    },
    followers : [ {type : ObjectId, ref : 'User'} ],
    following : [ {type : ObjectId, ref : 'User'} ]

})

const User =  mongoose.model('User', userSchema);
module.exports = User;
