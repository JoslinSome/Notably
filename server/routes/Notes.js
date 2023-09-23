import {noteModel} from "../models/Notes.js";
import express from "express";
import {compareSync} from "bcrypt";

const router = express.Router()

router.post("/create",async (req,res)=>{
    const {title,content} = req.body
    const date = new Date();
    const note = new noteModel({
        title,content, created: date, modified: date
    })
    await note.save()
    res.send(note)
})

router.put("/update",async (req,res)=>{
    const {id,title,content} = req.body
    const date = new Date();
    const note = await noteModel.findByIdAndUpdate(id,{title,content,modified: date})
    res.send(note)
})

router.get("/get-all",async (req,res)=>{
    const notes = await noteModel.find({})
    res.send(notes)
})
router.get("/get-by-id",async (req,res)=>{
    const {id} = req.body
    const note = await noteModel.findById(id)
    res.send(note)
})

router.delete("/delete",async (req,res)=>{
    const {id} = req.body
    const note = await noteModel.findByIdAndDelete(id)
    res.send(note)
})

export {router as NoteRouter}
