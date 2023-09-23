import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose";
import {UserRouter} from "./routes/Users.js"
import {NoteRouter} from "./routes/Notes.js"
import { NotebookRouter } from "./routes/Notebook.js";

dotenv.config()
const app =express()
app.use(express.json())
app.use(cors())
app.use("/auth",UserRouter)
app.use("/notes",NoteRouter)
app.use("/notebook",NotebookRouter)
console.log(process.env.MONGO_UNAME,process.env.MONGO_PWD)
mongoose.connect("mongodb+srv://"+process.env.MONGO_UNAME+":"+process.env.MONGO_PWD+"@notably.w0amtnw.mongodb.net/?retryWrites=true&w=majority")
     .then(r =>console.log("db connected")).catch(e=>console.log(e+"DB not connected check IP"))
app.listen(3002,()=> console.log("SERVER STARTED AT PORT 3002"))
