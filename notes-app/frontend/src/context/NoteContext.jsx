import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const getAuthConfig = () => {
    return {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    };
  };

  const fetchNotes = useCallback(async (search = '', color = '') => {
    if (!user) return;
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/notes?';
      if (search) url += `search=${search}&`;
      if (color) url += `color=${color}&`;
      
      const res = await axios.get(url, getAuthConfig());
      setNotes(res.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addNote = async (noteData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/notes', noteData, getAuthConfig());
      setNotes((prev) => [res.data, ...prev].sort((a, b) => b.isPinned - a.isPinned));
      return { success: true };
    } catch (error) {
      console.error('Error adding note:', error);
      return { success: false };
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${id}`, noteData, getAuthConfig());
      setNotes((prev) => 
        prev.map((note) => (note._id === id ? res.data : note))
            .sort((a, b) => b.isPinned - a.isPinned)
      );
      return { success: true };
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false };
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, getAuthConfig());
      setNotes((prev) => prev.filter((note) => note._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting note:', error);
      return { success: false };
    }
  };

  const togglePin = async (id, currentPinStatus) => {
    await updateNote(id, { isPinned: !currentPinStatus });
  };

  return (
    <NoteContext.Provider value={{ notes, loading, fetchNotes, addNote, updateNote, deleteNote, togglePin }}>
      {children}
    </NoteContext.Provider>
  );
};
