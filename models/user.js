const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
        
        name: {
            type: String,
            required: true,
            unique: 0,
            trim: true
        },

        gender: {
            type: String,
            required: true,
            unique: 0,
            trim: true
        },
    
        email: {
            type: String,
            required: true,
            unique: 1,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 8
        }
});

let SALT = 10;

//Hashing password before saving it to database
userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(SALT, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    }
    else {
        next()
    }
})

//comparing passwords
userSchema.methods.comparePassword = function(userPassword, checkpassword) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if(err) return checkpassword(null, err)
        checkpassword(null, isMatch)
    })
}

module.exports = mongoose.model('User', userSchema); 
