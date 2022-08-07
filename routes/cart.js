const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const {verifyTokenAndAuthorization, verifyToken,verifyTokenAndAdmin} = require("./verifyToken")

// CREATE
router.post('/', verifyToken, async (req,res) =>{
    const newCart = new Cart(req.body)

    try{
        const savedCart = await newCart.save();
        res.status(201).json({
            Message: savedCart
        })
    }catch(err){
        res.status(500).json(err)
    }
})

// UPDATE
router.put('/:id', verifyToken, async (req,res)=>{
    
    try{
        const updatedCart = await Product.findByIdAndUpdate(req.params.id, 
        {...req.body},{new: true})
        res.status(200).json(updatedCart)
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// DELETE
router.delete('/:id', verifyToken, async (req,res)=>{

    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json({
            Message: "Cart Deleted"
        })
    }
    catch(err){
        res.status(500).json({
            Message: (err)
        })
    }

})

// GET User CART
router.get('/find/:userId', verifyTokenAndAuthorization, async (req,res)=>{

    try{
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart)
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
        const carts = await Order.find();
        res.status(200).json(carts) 
    }
    catch(err){
        res.status(500).json(err)
    }
})


module.exports = router;