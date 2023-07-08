const mongoose = require("mongoose");

const OSchemaDefinition = {
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: { 
        type: String,
        required: true,
        unique: true
    },
	avatar: {
        type: Number,
        required: true
    },
    key: {
        type: String, 
        required: true
    }, 
    isReady: {
        type: Boolean, 
        required: true
    }, 
    banWord: {
        type: [String], 
    }, 
    currentRoom: {
        type: Number, 
        required: true
    },
    isAlive: {
        type: Number, 
        required: true
    }
    
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const UserModel = mongoose.model("user", schema);

module.exports = UserModel;
