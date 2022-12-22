var mongoose = require('mongoose');
//User schema
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    userName:{
        type: String,
        required: true,
        trim: true
    },
    role:{
        type: String,
        required: true,
        trim: true
    }
})
var User = mongoose.model('User', UserSchema, 'Users');

module.exports.getUserByEmail = async function (email, callback) {
    await User.find({email}, callback).clone();  
}

