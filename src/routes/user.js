const router = require('express').Router();
const RoomModel = require('../models/room');
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
    console.log("call banwords")
    try {
        const { user } = req.body;
        console.log("user", user)
        const updatedUser = await UserModel.findByIdAndUpdate( 
            user.userId, 
            { banWord: user.banWord },
            { new: true }
        );   
        console.log("updated, user", updatedUser)
        const currentRoom = await RoomModel.findOne({ roomId: user.currentRoom })
        
        // find the index of the user to be updated in the users array
        const userIndex = currentRoom.users.findIndex(u => u._id == updatedUser.userId);
        
        if (userIndex > -1) {
            // remove the user from the array
            currentRoom.users.splice(userIndex, 1);
            // add the updated user to the array
            currentRoom.users.push(updatedUser);
            // save the changes to the database
            await currentRoom.save();
        }
        
        return res.status(200).json("success");
    } catch (err) {
        return res.status(574).send(err);
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