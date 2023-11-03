const mongoose =require('mongoose');
const jwt = require('jsonwebtoken');
const { Schema } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]
});


userSchema.methods.generateAuthToken = function() {
    const user = this;
    // console.log(user._id);
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    console.log(token);
    user.tokens = user.tokens.concat({token});
    
    user.save();
    return {user, token};
}




const User = mongoose.model('User', userSchema);


module.exports = { User };