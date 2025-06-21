// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Create an Axios instance that targets your Railway backend in production
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/', // '/' hits CRA proxy in development
});

function App() {
  const [notes, setNotes]       = useState([]);
  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  // Load all notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await API.get('/notes');
      setNotes(res.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Could not load notes.');
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new note
  const handleAdd = async e => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const res = await API.post('/notes', { title: title.trim(), content: content.trim() });
      // Prepend new note to list
      setNotes([res.data, ...notes]);
      setTitle('');
      setContent('');
      setError('');
    } catch (err) {
      console.error('Failed to add note:', err);
      setError(err.response?.data?.error || 'Add note failed');
    }
  };

  // Handle deleting a note
  const handleDelete = async id => {
    try {
      await API.delete(`/notes/${id}`);
      setNotes(notes.filter(n => n.id !== id));
      setError('');
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Delete note failed');
    }
  };

  return (
    <div className="app-container">
      <h1>Full-Stack Notes</h1>

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
        <p>Loading notes…</p>
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

export default App;
