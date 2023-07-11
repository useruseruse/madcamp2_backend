const mongoose = require("mongoose");

const OSchemaDefinition = {
 	name : {
        type: String,
        required: true
    },
	chat : { 
        type: String,
        required: true
    },
	avatar : {
        type: String,
        required: true
    },
	room : {
        type: String,
        required: true
    }
}

const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const ChatModel = mongoose.model("chat", schema);

module.exports = ChatModel;
