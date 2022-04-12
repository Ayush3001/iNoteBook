import React, { useContext, useEffect,useRef,useState } from "react";

import noteContext from "../context/notes/noteContext";
import { AddNotes } from "./AddNotes";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";
export const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes,editNote } = context;
  const navigate=useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token'))
    {
    getNotes();
    }
    else{
      navigate('/login')
    }
    // eslint-disable-next-line
  }, []);
  const ref = useRef(null)
  const refClose = useRef(null)
   const [note, setNote] = useState({id:"",etitle:"",edescription:"",etag:""})
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag});
  };
   
   const handleClick=(e)=>{
     console.log("updating note...",note);
       editNote(note.id,note.etitle,note.edescription,note.etag);
       refClose.current.click();
       props.showAlert("note updated succesfully","success");
   }
   const onChange=(e)=>{
    setNote({...note,[e.target.name]:e.target.value});//use of spread operator
   }
  return (
    <>
      <AddNotes showAlert={props.showAlert} />

      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Edit Note
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
                Modal title
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              title
            </label>
            <input
              type="text"
              className="form-control"
              id="etitle"
              name="etitle"
              aria-describedby="emailHelp"
              onChange={onChange}
              value={note.etitle}
            />
            
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
            description
            </label>
            <input
              type="text"
              className="form-control"
              id="edescription"
              name="edescription"
              onChange={onChange}
              value={note.edescription}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
            tag
            </label>
            <input
              type="text"
              className="form-control"
              id="etag"
              name="etag"
              onChange={onChange}
              value={note.etag}
            />
          </div>
        </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button disabled={note.etitle.length<5 || note.edescription.length<8} type="button" className="btn btn-primary" onClick={handleClick}>
                update note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <h2>Your Notes</h2>
        {notes.length>0?notes.map((note) => {
          return (
            <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />
          );
        }):
        "no notes to display"}
      </div>
    </>
  );
};
