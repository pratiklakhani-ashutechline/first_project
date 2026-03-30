const moongoose = require('mongoose');

const loginSchema = new moongoose.Schema({ 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports = moongoose.model('User', loginSchema);