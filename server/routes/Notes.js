import { noteModel } from "../models/Notes.js";
import express from "express";
import { compareSync } from "bcrypt";
import fs from "fs";
import path from "path";
import jpeg from "jpeg-js";
import multer from 'multer';
import { notebookModel } from "../models/Notebooks.js";
import vision from '@google-cloud/vision';
import OpenAI from 'openai';
import dotenv from "dotenv"

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
  const { id, title, content } =req.body.params;
  const date = new Date();
  let string =""
  for (let i = 0; i < content.length; i++) {
    string+=content[i]
  }
  console.log(string,"ssdf")
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

router.get("/get-by-id", async (req, res) => {
  const { id } = req.query;
  const note = await noteModel.findById(id);
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

async function APIcall (text) {
  dotenv.config();
  const openai = new OpenAI({
    apiKey: process.env.GPT_KEY // This is also the default, can be omitted
  });
  const chatHistory = [];
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": "I have an exam coming up, can you generate flashcards for me to study with considering that i have the following notes of course work'"+text+"'.Generate only 3 flashcards as quickly as possible, Please return the result to me as an array of json objects. each object should contains a field called 'question' with the question to be asked and a field called 'answer' being the response to the question. Do not return any text aside from the array of json response, I only want the resulting array. Under no circumstances will you give me starting words such as 'Here is the array of JSON objects as requested:' in the response content."}]
    });

    console.log(chatCompletion.choices[0].message);
    return chatCompletion.choices[0].message;

  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.data);
    } else {
      console.log(err.message);
    }
  }
};

router.get("/get-flash-cards", async (req, res) => {
  const { text } = req.query;
  console.log("In here",text)
  const flashCards = await APIcall(text);
  res.send(flashCards)
})


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
