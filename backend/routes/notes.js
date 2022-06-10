const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//  Route 1 : Fetch all notes using :GET '/api/notes/fetchallnotes'. Login required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//  Route 2 : Add new Note using :POST '/api/notes/addnote'. Login required
router.post("/addnote", fetchUser,
  [
    body("title", "Enter valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 character").isLength({ min: 5,}),
  ],async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are errors return bad request and the errors.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();
      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//  Route 3 : Update an exsisting Note using :PUT '/api/notes/updatenote'. Login required
router.put( "/updatenote/:id",fetchUser,async (req, res) => {
    const { title, description, tag } = req.body;
    try {
   // Create new note object
    const newNote = {};
    if (title){newNote.title=title};
    if (description){newNote.description=description};
    if (tag){newNote.tag=tag};

    //Find the Note to be updated & update it.
    let note = await Note.findById(req.params.id);
    if (!note){ 
        return res.status(404).send('Not Found')
    }
    if (note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }
  note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true} )
    res.json({note});
     } catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
  }
);

//  Route 4 : Delete an exsisting Note using :DELETE '/api/notes/deletenote'. Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
try {
  //Find the Note to be deleted & delete it.
  let note = await Note.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  //Allow Deletion only if user own this note
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndDelete(req.params.id);
  res.json({ Success: "Note has been Deleted", note: note });
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
});

module.exports = router;
