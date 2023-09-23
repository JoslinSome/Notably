import {userModel} from "../models/Users.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express";


const router = express.Router()

// Register Api
router.post("/register", async  (req,res)=>{h
    const {username,password,firstname,lastname} = req.body
    const user = await userModel.findOne({username})
    if(user){
        return res.json({message: "User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password,10)

    const newUser =new userModel({username,password: hashedPassword,firstname,lastname})
    await newUser.save().then(r=>{})
    return res.json({message: "User successfully created"})
})

// Login Api
router.post("/login", async (req,res) =>{
    const {username, password} = req.body
    const user = await userModel.findOne({username})
    if (!user){
        return res.json({message: "User does not exist"})
    }
    const isPasswordValid = await bcrypt.compare(password,user.password)
    if(!isPasswordValid){
        return res.json({message: "Username or Password incorrect"})
    }
    const token = jwt.sign({id: user._id}, "secret")
    res.json({token, username: user.username,user})
})

router.get("/get-all-users", async (req,res) =>{
    const users = await userModel.find({})
    res.json({users})
})

router.get("/get-user-by-name", async (req,res) =>{
    const {username} = req.query
    const user = await userModel.find({username})
    if(!user){
        return res.json({message: "Invalid user"})
    }
    res.json({user})
})
router.get("/get-client-id", async (req,res) =>{
    res.json({clientId: process.env.SPOTIFY_CLIENT})
})
router.get("/get-user-by-id", async (req,res) =>{
    const {id} = req.query
    const user = await userModel.findById(id)
    if(!user){
        return res.json({message: "Invalid user"})
    }
    res.json(user)
})

export {router as UserRouter}
