const router = require('express').Router();
const RoomModel = require('../models/room');
const UserModel = require('../models/user');



// getRoomList
router.get('/all', async (req, res) => {
    try{
        const roomList= await RoomModel.find()
        if (!roomList) return res.status(404).send({ err: 'Cannot Find Room' });
        else return res.status(200).json( roomList );
    }catch(err){
        return res.status(500).send(err);
    }
});

// addRoom
router.post('/add', async (req, res) => {
    try{
        const { room }  = req.body;
        const roomId = room.roomId
        const users = room.users
        const roomTitle = room.roomTitle
        const roomMode = room.roomMode
        const roomMinPpl = room.roomMinPpl
        const roomMaxPpl = room.roomMaxPpl
        const isStart = room.isStart
    
        const newRoom = await new RoomModel({roomId, users, roomTitle, roomMode, roomMinPpl, roomMaxPpl, isStart}).save();

        const updatedRoom = await RoomModel.findByIdAndUpdate(
            newRoom._id,
            { roomId: newRoom._id },
            { new: true }
        );
        const updatedUser = await UserModel.findByIdAndUpdate(
            users[0].userId, 
            {currentRoom: newRoom._id},
            {new: true}
        );

        if (!updatedRoom) return res.status(404).send({ err: 'Cannot Add Room' });
        else {
            return res.status(200).json(updatedRoom);
        }


    }catch(err){
        return res.status(500).send(err);
    }
});

// enterRoom
router.post('/enter', async (req, res) => {
    try {
        const roomAndUser = req.body;
        const roomId = roomAndUser.roomId
        const user = roomAndUser.user
        const update_currRoom = await UserModel.updateOne({userId: user.userId}, {currentRoom: roomId})
        if(!update_currRoom) return res.status(444).json("cannot update user's current room ")

        const room = await RoomModel.findOne({ roomId: roomId });
        const added_user = await UserModel.findOne({ userId: user.userId });
        room.users.push(added_user); // users 배열에 added_user 추가
        const update_roomUsers = await RoomModel.updateOne({ roomId: roomId }, { users: room.users }); // users 필드에 전체 배열 할당

        if(!update_roomUsers) return res.status(454).json("cannot update users in room ")

        return res.status(200).json(true);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// leaveRoom
router.post('/leave', async (req, res) => {
    try {
        const { user } = req.body;
        const curr_room_id = user.currentRoom
        const curr_room = await RoomModel.findOne({roomId: curr_room_id})
        if (!curr_room) {
            return res.status(444).json("user is not in any room");
        }
        else if(curr_room.users.length == 1){       //남은 유저가 한명이면 방 폭파 
            const update_currRoom = await UserModel.updateOne({userId: user.userId},{currentRoom: -1})
            if(update_currRoom) return res.status(454).json("user cannot leave a room ")

            const delete_room = await RoomModel.deleteOne({roomId: curr_room_id})          
            if (delete_room) return res.status(464).json("room is not properly deleted")
            
            return res.status(200).json("user properly leaved room and room deleted")
        }
        else{                                       //남은 유저가 여러명이면 방의 유저 변경 
            const users = curr_room.users.filter((e) => e.userId !== user.userId);
            const update_roomUsers = await RoomModel.updateOne({roomId: curr_room_id},{users: users})
            if(!update_roomUsers) return res.status(474).json("user did not leave the room")

            const update_currRoom = await UserModel.updateOne({userId: user.userId},{currentRoom: -1})
            if (!update_currRoom) return res.status(484).json("room is not properly updated")

           return res.status(200).json("user properly leaved room and room updated")
        }
    } catch (err) {
        return res.status(500).send(err);
    }
});


// getMyRoom
router.post('/getMyRoom', async (req, res) => {
    try {
        const { user } = req.body;
        const roomId = user.currentRoom
        const room = await RoomModel.findOne({roomId: roomId})
        
        if (room) return res.status(200).json(room);
        else return res.status(404).json("user is not in any room");
    } catch (err) {
        
        return res.status(500).send(err);
    }
});

module.exports = router;