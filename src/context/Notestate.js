import noteContext from "./notes/Notecontext";
import React, { useState } from "react";

const Notestate = (props) => {
  const host = "http://localhost:5000";
  const initialnotes = [];
  const [notes, setNotes] = useState(initialnotes);

  //Get all Notes
  const getNotes = async () => {
    //API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      }
    });
    const json = await response.json();
    setNotes(json);
  };

  //Add a Note
  const addNote = async (title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const note = await response.json();
    //console.log(json);
    // const note = {
    //   _id: "627890f2sade68551de2adac5d678687",
    //   user: "6277dcf615be25fba844f5cd",
    //   title: title,
    //   description: description,
    //   tag: tag,
    //   date: "2022-05-09T03:56:34.320Z",
    //   __v: 0,
    // };
    setNotes(notes.concat(note));
  };

  //Delete a Note
  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      }
    });
    const json =await response.json(); // parses JSON response into native JavaScript objects
    console.log(json);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    console.log(json);
    // logic to edit in client
    let newNote = JSON.parse(JSON.stringify(notes)); 
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  }

  return (
    <noteContext.Provider value={{ notes, addNote, deleteNote, editNote , getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default Notestate;
