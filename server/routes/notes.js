const express = require("express");
const { model } = require("mongoose");
const Note = require("../models/Note"); //Mongoose Note Model
const { body, validationResult } = require("express-validator");
const fetchuser = require("../Middleware/fetchuser");
const { route } = require("./auth");

const router = express.Router();

// Route 1: Fetch all Notes GET : "api/notes/fetchallnotes"  Login Required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: add a note POST: "/api/notes/addnote"  Login Required

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Atleast contain 3 characters").isLength({ min: 3 }),
    body("description", "Atleast contain 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // Getting the result from the express-validator and if it throws a error code will return from here only.
    const result = validationResult(req);
    // if express validator find a error it will status code 400 with json of error.
    if (!result.isEmpty()) {
      return res.status(400).json({ result: result.array() });
    }

    // destructuring the data from req body.

    const { title, description, tag } = req.body;

    try {
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3: update a Note POST: "/api/notes/update"  Login Required

router.put("/update/:id", fetchuser, async (req, res) => {
  // destructuring the data from req body.

  const { title, description, tag } = req.body;

  // Creating  a new Note object.

  const newNote = {};

  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  // finding the note which your want to update.

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Delete a Note POST: "/api/notes/delete"  Login Required

router.delete("/delete/:id", fetchuser, async (req, res) => {
  // finding the note which your want to update.

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
