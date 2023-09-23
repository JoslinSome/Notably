import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    notebooks: [{ type : mongoose.Schema.Types.ObjectId, ref: 'notebooks' }],
})

export const userModel = mongoose.model("users",UserSchema)
