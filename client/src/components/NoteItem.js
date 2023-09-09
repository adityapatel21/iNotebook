import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const { note, editNote } = props;

  const context = useContext(noteContext);

  const { deleteNote } = context;

  return (
    <div className="col-md-3 my-3">
      <div className="card">
        <span
          className="position-absolute top-0 translate-middle badge rounded-pill bg-danger"
          style={{ left: "80%", zIndex: 1 }}
        >
          {note.tag}
        </span>
        <div className="card-body">
          <h5 className="card-title">{note.title} </h5>
          <p className="card-text">{note.description}</p>
          <i
            className="fa-solid fa-trash mx-3"
            onClick={() => {
              deleteNote(note._id);
            }}
          ></i>
          <i
            className="fa-solid fa-pen mx-3"
            onClick={() => editNote(note)}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
