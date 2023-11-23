const express = require('express');
const { User } = require('../models/User');
const router = express.Router();

//create user
// No auth
router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if(!name || !email || !password) {
        return res.send('Fill all fields!');
    }

    try {
        let user = await User.findOne({email});
        if(user) {
            return res.send("User Already Exists");
        }

        user = new User({
            name, 
            email,
            password
        });
    
        await user.save();
        return res.status(200).send(user);
    } catch(e) {
        console.log(e);
        return res.status(500).send(e);
    }
})

//get user
// router.get('/', async (req, res) => {
    
// })

// login
// No auth
router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.send('Email or Password is incorrect!');
        }

        if(password != user.password) {
            return res.send('Email or Password is incorrect!');
        }

        token = user.generateAuthToken().token;

        res.status(200).send(token);
    } catch(e) {
        console.log(e);
        res.status(500).send(e);
    }
}) 


module.exports = router;