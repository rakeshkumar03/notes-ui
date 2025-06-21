import React from 'react';

export default function NoteCard({ note, onDelete }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <button onClick={() => onDelete(note.id)}>Delete</button>
    </div>
  );
}
