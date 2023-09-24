import express from "express";
import { notebookModel } from "../models/Notebooks.js";
import { userModel } from "../models/Users.js";
const router = express.Router();

router.post("/create", async (req, res) => {
  const { title, description, user} = req.body;
  const date = new Date();
  const notebook = new notebookModel({
    title,
    description,
    created: date,
    modified: date,
    user
  });
  const User = await userModel.findById(user._id);
  User.notebooks.push(notebook._id);
  await User.save();
  await notebook.save();
  res.send(notebook);
});

router.put("/update", async (req, res) => {
  const { id, title, description } = req.body;
  const date = new Date();
  const notebook = await notebookModel.findByIdAndUpdate(id, {
    title,
    description,
    modified: date,
  });
  await notebook.save();
  res.send(notebook);
});

router.get("/get-all", async (req, res) => {
  const notebooks = await notebookModel.find({});
  res.send(notebooks);
});

router.get("/get-by-user/:userId", async (req, res) => {
  const { userId } = req.params;
  const notebooks = await notebookModel.find({ user: userId });
  res.send(notebooks);
});

router.get("/get-by-id", async (req, res) => {
  const { id } = req.body;
  const notebook = await notebookModel.findById(id);
  res.send(notebook);
});

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  const notebook = await notebookModel.findByIdAndDelete(id);
  res.send(notebook);
});

export { router as NotebookRouter };
