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
router.post('/addRoom', async (req, res) => {
    try{
        const newRoom = new RoomModel(user, roomTitle, roomMode, roomMinPpl, roomMaxPpl, isStart);
        const result = await newRoom.save()
        if (!result) return res.status(404).send({ err: 'Cannot Add Room' });
        else return res.status(200).json({ isOK: true });
    }catch(err){
        return res.status(500).send(err);
    }
});

module.exports = router;