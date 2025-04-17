const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        default: ''
    },
    
    dob: {
        type: Date,
        default: null
    },
    profileImage: {
        type: String,
        default: ''
    }

}, { timestamps: true }); // Adds createdAt and updatedAt


// Apply the auto-incrementing plugin to the user schema
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;
