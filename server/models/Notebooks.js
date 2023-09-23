import mongoose from "mongoose";

const NotebookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  created: { type: Date, default: Date.now },
  modified: { type: Date, default: Date.now },
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "notes" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

export const notebookModel = mongoose.model("notebooks", NotebookSchema);
