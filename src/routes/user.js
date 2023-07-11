const router = require('express').Router();
const UserModel = require('../models/user');

// getUserAll
router.get('/all', async (req, res) => {
    try {
        const userList = await UserModel.findAll();
        if (!userList) return res.status(404).send({ err: 'Cannot Get User List' });
        else return res.status(200).json(userList);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// getUser
router.post('/get', async (req, res) => {
    try {
        const { user } = req.body;
        const foundUser = await UserModel.findById(user.userId)
        if (!foundUser) return res.status(404).send({ err: 'User Not Found' });
        else return res.status(200).json(foundUser);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// addUser
router.post('/add', async (req, res) => {
    try{
        const { user } = req.body;
        const userId = user.userId
        const name = user.name
        const avatar = user.avatar
        const key = user.key
        const banWord = user.banWord
        const currentRoom = user.currentRoom
        const isReady = user.isReady
        const isAlive = user.isAlive 
        const newUser = await new UserModel({userId, name, avatar, key, isReady, banWord, currentRoom, isAlive}).save();

        const updatedUser = await UserModel.findByIdAndUpdate(
            newUser._id,
            { userId: newUser._id },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send({ err: 'Cannot Add User' });
        else {
            return res.status(200).json(updatedUser);
        }
    } catch(err){
        return res.status(530).send(err);
    }
});

// isUserExist
router.post('/exist', async (req, res) => {
    try {
        const { user } = req.body;
        const foundUser = await UserModel.findOne({ key: user.key});
        if (!foundUser) return res.status(404).send({ err: 'User Not Found' });
        else return res.status(200).json(foundUser);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// isNameExist
router.post('/nameExist', async (req, res) => {
    try {
        const { user } = req.body;
        const foundUser = await UserModel.findOne({ name: user.name });
        if (foundUser) return res.status(200).json(true);
        else return res.status(200).json(false);
    } catch (err) {
        return res.status(500).send(err);
    }
});

// deleteUser
router.post('/delete', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await UserModel.findByIdAndDelete(user.userId);
        if (result.deletedCount === 0) return res.status(404).send({ err: 'User Not Delete' });
        else return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});

// setAvatar
router.post('/avatar', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await UserModel.findByIdAndUpdate(user.userId, { avatar: user.avatar });
        if (result.nModified === 0) return res.status(404).send({ err: 'Avatar not changed' });
        else return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});

// setReady
router.post('/ready', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await UserModel.updateOne({ id: user.id }, { isReady: user.isReady });
        if (result.nModified === 0) return res.status(404).send({ err: 'User Not Found' });
        else return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});

// setBanwords (need to test)
router.post('/banwords', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await UserModel.findByIdAndUpdate( user.userId, { banWord: user.banWord });       //유저 업데이트 S
        const room = await RoomModel.findById(user.currentRoom)
        const update_roomUsers =  await room.updateOne({"users._id":user.id}, {"users.banword": user.banWord })   // 유저가 있는 room의 users에서 하나의 user만 업데이트 
        if (result.nModified === 0) return res.status(404).send({ err: 'User Not Found' });
        else return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});

// setDead
router.post('/dead', async (req, res) => {
    try {
        const { userid } = req.body;
        const result = await UserModel.updateOne({ id: user.id }, { isAlive: false });
        if (result.nModified === 0) return res.status(404).send({ err: 'User Not Found' });       
        else return res.status(200).json();
    } catch (err) {
        return res.status(500).send(err);
    }
});


module.exports = router;