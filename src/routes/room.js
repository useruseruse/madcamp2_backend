const router = require('express').Router();
const RoomModel = require('../models/room');
const UserModel = require('../models/user');



// getRoomList
router.get('/all', async (req, res) => {
    try{
        const roomList= await RoomModel.find()
        console.log(roomList)
        if (!roomList) return res.status(404).send({ err: 'Cannot Find Room' });
        else return res.status(200).json({ roomList: roomList });
    }catch(err){
        console.log(err)
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
        console.log(`room : ${room}`)
        console.log(typeof users)
        console.log(`title : ${users}`)
        
        const newRoom = new RoomModel({roomId, users, roomTitle, roomMode, roomMinPpl, roomMaxPpl, isStart});
        console.log(`title : ${newRoom}`)
        const result = await newRoom.save()
        if (!result) return res.status(404).send({ err: 'Cannot Add Room' });
        else return res.status(200).json({ isOK: true });
    }catch(err){
        return res.status(500).send(err);
    }
});

// enterRoom
router.post('/enter', async (req, res) => {
    try {
        const roomAndUser = req.body;
        const room = roomAndUser.room
        const user = roomAndUser.user
        const update_currRoom = await UserModel.updateOne({id: user.id}, {currentRoom: room.id})
        if(!update_currRoom) return res.status(404).json("cannot update user's current room ")

        const users = room.users.push(user)
        const update_roomUsers = await RoomModel.updateOne({id: room.id}, {users: users})
        if(!update_roomUsers) return res.status(404).json("cannot update users in room ")

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
        const curr_room = await RoomModel.findOne({id: curr_room_id})
        if (!curr_room) {
            return res.status(200).json("user is not in any room");
        }
        else if(curr_room.users.length == 1){       //남은 유저가 한명이면 방 폭파 
            const update_currRoom = await UserModel.updateOne({id: user.id},{currentRoom: -1})
            if(update_currRoom) return res.status(404).json("user cannot leave a room ")

            const delete_room = await RoomModel.deleteOne({id: curr_room_id})          
            if (delete_room) return res.status(404).json("room is not properly deleted")
            
            return res.status(200).json("user properly leaved room and room deleted")
        }
        else{                                       //남은 유저가 여러명이면 방의 유저 변경 
            const update_currRoom = await UserModel.updateOne({id: user.id},{currentRoom: -1})
            if (!update_currRoom) return res.status(404).json("room is not properly updated")

            const users = curr_room.users.filter((e) => e !== user);
            const update_roomUsers = await RoomModel.updateOne({id: curr_room_id},{users: users})
            if(!update_roomUsers) return res.status(404).json("user did not leave the room")

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
        console.log(`id : ${roomId}`)
        if (room) return res.status(200).json(room);
        else return res.status(404).json("user is not in any room");
    } catch (err) {
        console.log(err)
        return res.status(500).send(err);
    }
});

module.exports = router;