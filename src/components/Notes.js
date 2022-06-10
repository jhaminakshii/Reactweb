import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/Notecontext";
import AddNote from "./AddNote";
import NoteItems from "./NoteItems";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const data = useContext(noteContext);
   const navigate = useNavigate();
  const { notes, getNotes, editNote } = data;
  useEffect(() => {
    if(localStorage.getItem('token')){
     getNotes();
     console.log('get data');
    }else{
      console.log("redirect");
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const ref = useRef(null);
  const closeref = useRef(null);
  const [note, setNote] = useState({
      id:"",
    etitle: " ",
    edescription: " ",
    etag: "default",
  });
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id:currentNote._id,etitle: currentNote.title, edescription :currentNote.description,etag:currentNote.tag});
  };
  

  const handleOnClick = () => {
      editNote(note.id,note.etitle,note.edescription,note.etag);
      closeref.current.click();
       props.showAlert("Note Updateded Successfully", "success");
    console.log("updating")
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote showAlert = {props.showAlert}/>

      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    aria-describedby="emailHelp"
                    value={note.etitle}
                    onChange={onChange}
                    minLength={5}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    aria-describedby="emailHelp"
                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={closeref}
              >
                Close
              </button>
              <button
                disabled={note.etitle.length < 5 || note.edescription.length < 5}
                type="button"
                className="btn btn-primary"
                onClick={handleOnClick}
              >
                update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-3 row">
        <h2>Your Notes</h2>
        <div className="container">
          {notes.length === 0 && "No Notes To Display"}
        </div>
        {notes.map((note) => {
          return (
            <NoteItems key={note._id} updateNote={updateNote} notes={note}  showAlert = {props.showAlert}/>
          );
        })}
      </div>
    </>
  );
};

export default Notes;
