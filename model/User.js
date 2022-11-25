const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    accountNumber: {
        type: String,
        required: false
    },
    currency: {
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
    phone: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now
    }
});

module.exports = User = model("User", UserSchema);