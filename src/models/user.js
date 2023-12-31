const mongoose = require("mongoose");

const OSchemaDefinition = {
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: { 
        type: String,
        required: true,
        unique: true
    },
	avatar: {
        type: String,
        required: true,
    },
    key: {
        type: String, 
        required: true
    }, 
    isReady: {
        type: Boolean, 
        required: true,
        default: false
    }, 
    banWord: {
        type: [String], 
    }, 
    currentRoom: {
        type: String, 
        required: true
    },
    isAlive: {
        type: Boolean, 
        required: true,
        default: true
    }
    
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const UserModel = mongoose.model("user", schema);

module.exports = UserModel;
