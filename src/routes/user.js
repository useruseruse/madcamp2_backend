const router = require('express').Router();
const UserModel = require('../models/user');

// getUser
router.get('/getUser', async (req, res) => {
    try{
        const { key, name, avatar } = req.body;
        const newUser = new UserModel({key, name, avatar});
        const result = await newUser.save()
        if (!result) return res.status(404).send({ err: 'Cannot Add User' });
        else return res.status(200).json({ isOK: true });
    }catch(err){
        return res.status(500).send(err);
    }
});


router.post('/isUserExists', async (req, res) => {
    try{
        const { user } = req.body;
        console.log(user);
        console.log("왜안돼")
        const resultUser = await UserModel.findOne({key: user.key});
        if (!resultUser) return res.status(404).send({ err: 'Cannot Find User' });
        else return res.status(200).json({ exists: true });
    }catch(err){
        return res.status(500).send(err);
    }
});

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
router.get('/get', async (req, res) => {
    try {
        const { user } = req.body;
        const foundUser = await UserModel.findOne({ id: user.id });
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

        const newUser = new UserModel({userId, name, avatar, key, isReady, banWord, currentRoom, isAlive});
        console.log("new",newUser)
        const result = await newUser.save();

        console.log("saved", result)
        if (!result) return res.status(404).send({ err: 'Cannot Add User' });
        else return res.status(200).json({ isOK: true });
    }catch(err){
        console.log("error ", err)
        return res.status(530).send(err);
    }
});


// isUserKeyExist
router.post('/exist', async (req, res) => {
    try {
        const { user } = req.body;
        const foundUser = await UserModel.findOne({ key: user.key});
        if (foundUser) return res.status(200).json(true);
        else return res.status(200).json(false);
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
        const result = await UserModel.deleteOne({ id: user.id });
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
        const result = await UserModel.updateOne({ id: user.id }, { avatar: user.avatar });
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

// setBanwords
router.post('/banwords', async (req, res) => {
    try {
        const { user } = req.body;
        const result = await UserModel.updateOne({ id: user.id }, { banWord: user.banWord });
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