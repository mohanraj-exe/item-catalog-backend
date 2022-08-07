const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Imports
const User = require('../models/User');

router.post('/register', async (req,res) =>{

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    })

    try{
        await newUser.save();
        res.status(201).json(
            {Message: "User Registered Successfully"}
        )
    }
    catch(err){
        res.status(500).json(err)
    }
})

router.post('/login', async (req,res) =>{

    try{
        const user = await User.findOne({ username: req.body.username });

        !user && res.status(401).json({
                Message: "User does not exists"
            })
        
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY)
    
        const Originalpassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        Originalpassword !== req.body.password && res.status(401).json({
                Message: "Incorrect UserName/Password"
            })
        
            // res.status(200).json({
            //     Message: "User Successfully Logged In"
            // })

            const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET_KEY,
            {expiresIn: "3d"})

            const {password, ...others} = user._doc;
            res.status(200).json({...others, accessToken})
            
    }
    catch(err){
        res.status(500).json(err)
    }


})

module.exports = router;