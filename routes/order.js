const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const {verifyTokenAndAuthorization, verifyToken,verifyTokenAndAdmin} = require("./verifyToken")

// CREATE
router.post('/', verifyToken, async (req,res) =>{

    const newOrder = new Order(req.body)
    try{
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder)
    }catch(err){
        res.status(500).json(err)
    }
})

// UPDATE
router.put('/:id', verifyTokenAndAdmin, async (req,res)=>{
    
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, 
        {...req.body},{new: true})
        res.status(200).json(updatedOrder)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req,res)=>{

    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json({
            Message: "Order Deleted"
        })
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// GET User Orders
router.get('/find/:userId', verifyTokenAndAuthorization, async (req,res)=>{

    try{
        const orders = await Order.findOne({userId: req.params.userId})
        res.status(200).json(orders)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// GET ALL 
router.get("/", verifyTokenAndAdmin, async (req,res) =>{
    try{
        const orders = await Order.find();
        res.status(200).json(orders) 
    }
    catch(err){
        res.status(500).json(err)
    }
})

// GET INCOME
router.get("/income", verifyTokenAndAdmin, async(req,res) =>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1))

    try{
        const income = await Order.aggregate([
            { $match: {createdAt: { $gte: previousMonth }} },
            { $project: {month: { $month: "$createdAt" }, sales: "$amount"} },
            { $group: {
                _id: "$month",
                total: {$sum: "$sales"}
            }}
        ])
        res.status(200).json(income)
    }catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;