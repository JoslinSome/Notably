import { noteModel } from "../models/Notes.js";
import express from "express";
import { compareSync } from "bcrypt";
import fs from "fs";
import path from "path";
import jpeg from "jpeg-js";
import multer from 'multer';
import { notebookModel } from "../models/Notebooks.js";
import vision from '@google-cloud/vision';

const router = express.Router();

router.post("/create", async (req, res) => {
  const { notebookId } = req.body;
  const date = new Date();
  const note = new noteModel({
    title: "New Note",
    content: "New Note",
    created: date,
    modified: date,
    notebook: notebookId,
  });
  const notebook = await notebookModel.findById(notebookId);
  await note.save();
  notebook.notes.push(note._id);
  await notebook.save()
  res.send(note);
});

router.put("/update", async (req, res) => {
  const { id, title, content } = req.body;
  const date = new Date();
  let string =""
  for (let i = 0; i < content.length; i++) {
    string+=content[i]
  }
  const note = await noteModel.findByIdAndUpdate(id, {
    title,
    content: string,
    modified: date,
  });
  res.send(note);
});

router.get("/get-all", async (req, res) => {
  const notes = await noteModel.find({});
  res.send(notes);
});

router.get("/get-by-notebook/:notebookId", async (req, res) => {
   const { notebookId } = req.params;
    const notes = await noteModel.find({ notebook: notebookId });
    res.send(notes);
});

// router.get("/get-by-user/:userId", async (req, res) => {
//     const { userId } = req.params;
//     const notebooks = await notebookModel.find({ user: userId });
//     res.send(notebooks);
//   });

router.delete("/delete", async (req, res) => {
  const { id } = req.body;
  const note = await noteModel.findByIdAndDelete(id);
  res.send(note);
});

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

router.post("/read-note", upload.single('image'), async (req, res) => {
  console.log("The file is: ", req.file);

  // The image file is saved in the 'uploads/' directory
  // You can move it to another directory or do whatever you want with it
  const text = await quickstart(req.file.path)
  res.send(text);
});
async function quickstart(path) {
  // Imports the Google Cloud client libraries

// Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  const fileName = path;
  console.log("reading file at",path)
  const request = {
    image: {
      content: fs.readFileSync(fileName),
    },
    feature: {
      languageHints: ['en-t-i0-handwrit'],
      type: "DOCUMENT_TEXT_DETECTION"
    },
  };

  const [result] = await client.documentTextDetection(request);
  const fullTextAnnotation = result.fullTextAnnotation;
  console.log(fullTextAnnotation.text)
  return fullTextAnnotation.text
}

export { router as NoteRouter };
