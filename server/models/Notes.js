import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  content: { type: String },
  notebook: { type: mongoose.Schema.Types.ObjectId, ref: "notebooks" },
});
export const noteModel = mongoose.model("notes", noteSchema);
