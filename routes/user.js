const express = require("express");
const User = require("../models/User");
const router = express.Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("./verifyToken")

router.put('/:id', verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, 
        {...req.body},{new: true})
        res.status(200).json(updatedUser)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// DELETE
router.delete('/:id', verifyTokenAndAuthorization, async (req,res)=>{

    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({
            Message: "User Account Deleted"
        })
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// GET
router.get('/find/:id', verifyTokenAndAdmin, async (req,res)=>{

    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// GET ALL Users 
router.get('/', verifyTokenAndAdmin, async (req,res)=>{

    const query = req.query.new;
    try{
        const users = query 
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();

        res.status(200).json(users)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// USER STATS
router.get('/stats', verifyTokenAndAdmin, async (req,res)=>{

   const date = new Date()
   const lastYear = new Date(date.setFullYear(date.setFullYear()-1))
  
   try{
    const data = await User.aggregate([
        {   $match: { createdAt: {$gte: lastYear}} },
        {
            $project:{
                month: { $month: "$createdAt" }
            },
        },
        {
            $group:{
                _id: "$month",
                total: { $sum: 1 } 
            }
        }
    ])
    res.status(200).json(data)
   }
   catch(err){
        res.status(500).json(err)
   }
})


module.exports = router