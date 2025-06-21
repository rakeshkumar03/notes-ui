// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [notes, setNotes]     = useState([]);
  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Load notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    try {
      const res = await axios.get('/notes');
      setNotes(res.data);
      setError('');
    } catch (err) {
      console.error('Fetch notes error:', err);
      setError('Could not load notes.');
    } finally {
      setLoading(false);
    }
  }

  // Add a new note
  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await axios.post('/notes', { title, content });
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
      setError('');
    } catch (err) {
      console.error('Add note error:', err);
      setError(err.response?.data?.error || 'Add note failed');
    }
  }

  // Delete a note
  async function handleDelete(id) {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      setError('');
    } catch (err) {
      console.error('Delete note error:', err);
      setError('Delete note failed');
    }
  }

  return (
    <div className="app-container">
      <h1>Notes app</h1>

      {error && <div className="error-banner">{error}</div>}

      <form className="note-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div className="note-card" key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => handleDelete(note.id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
