const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const verifyToken = (req, res, next) =>{

    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err,user) =>{
            if(err) res.status(401).json({
                Message: "Invalid Token"
            })
            req.user = user;
            next();
        })
    }
    else{
        return res.status(401).json({
            Message: "You are not authenicated"
        })   
    }
}

const verifyTokenAndAuthorization = (req, res, next) =>{
    
    verifyToken(req, res, () =>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json({
                Message: "Access Denied"
            })
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) =>{
    
    verifyToken(req, res, () =>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json({
                Message: "Access Denied"
            })
        }
    })
}


module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} ;