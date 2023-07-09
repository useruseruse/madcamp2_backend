const router = require('express').Router();
const RoomModel = require('../models/room');

router.get('/', async (req, res) => {
    res.send("test");
})

// getRoomList
router.get('/getRoomList', async (req, res) => {
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
        const { room } = req.body;
        const newRoom = new RoomModel(room.user, room.roomTitle, room.roomMode, room.roomMinPpl, room.roomMaxPpl, room.isStart);
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
        const { room } = req.enterRequest;

        // enterRoom 로직 구현 
        // user의 current room 바꾸고, room의 users 속성 바꾸기 
        
        return res.status(200).json(true);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// leaveRoom
router.post('/leave', async (req, res) => {
    try {
        const { userid, currentRoom } = req.body;
        // leaveRoom 로직 구현
        // 1. 사람> 1) currRoom = -1
        // 2. 사람 = 1 2)방폭파 1)currRoom = -1 
        return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});


// getRoomList
router.get('/all', async (req, res) => {
    try {
        const roomList = await RoomModel.findAll();
        if (!roomList) return res.status(404).send({ err: 'Cannot Get Room List' });
        else return res.status(200).json(roomList);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// getMyRoom
router.get('/getMyRoom', async (req, res) => {
    try {
        const { roomid } = req.body;
        // getMyRoom 로직 구현
        // ...
        return res.status(200).json(myRoom);
    } catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;