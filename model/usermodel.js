var db = require('./db');

const userSchema = new db.mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        fullname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        manage: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: false
        },

    },
    { collection: 'user' }
);

let userModel= db.mongoose.model('userModel',userSchema);

module.exports = {userModel}