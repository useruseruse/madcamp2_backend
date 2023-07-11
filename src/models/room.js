const mongoose = require("mongoose");

const OSchemaDefinition = { 
    roomId: {
        type: String,
        required: true
    },
	users: { 
        type: [Object],
        required: true
    },
	roomTitle: {
        type: String,
        required: true
    },
    roomMode: {
        type: String, 
        required: true
    }, 
    roomMinPpl: {
        type: Number, 
        required: true
    }, 
    roomMaxPpl: {
        type: Number, 
        required: true
    },
    isStart:{
        type: Boolean,
        required: true
    }
}
    

const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const RoomModel = mongoose.model("room", schema);

module.exports = RoomModel;
