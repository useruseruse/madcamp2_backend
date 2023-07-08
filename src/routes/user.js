const router = require('express').Router();
const UserModel = require('../models/user');


// addUser
router.post('/addUser', async (req, res) => {
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
        const { id } = req.body;
        const user = await UserModel.findOne({id: id});
        if (!user) return res.status(404).send({ err: 'Cannot Find User' });
        else return res.status(200).json({ exists: true });
    }catch(err){
        return res.status(500).send(err);
    }
});


module.exports = router;