import React, { useState, useEffect, useContext } from 'react';
import { NoteContext } from '../context/NoteContext';
import { FiX } from 'react-icons/fi';

const NoteModal = ({ isOpen, onClose, note }) => {
  const { addNote, updateNote } = useContext(NoteContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#ffffff');

  const colors = ['#ffffff', '#fecaca', '#fde68a', '#a7f3d0', '#bfdbfe', '#e9d5ff'];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
    } else {
      setTitle('');
      setContent('');
      setColor('#ffffff');
    }
  }, [note]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (note) {
      await updateNote(note._id, { title, content, color });
    } else {
      await addNote({ title, content, color, isPinned: false });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>{note ? 'Edit Note' : 'Create Note'}</h2>
          <FiX style={{ cursor: 'pointer', fontSize: '1.5rem' }} onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ fontSize: '1.2rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.05)' }}
            autoFocus
          />
          
          <textarea
            className="input-field"
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ minHeight: '200px', resize: 'vertical', fontSize: '1rem' }}
          />

          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Color:</span>
            <div className="color-picker">
              {colors.map((c) => (
                <div
                  key={c}
                  className={`color-circle ${color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c, border: c === '#ffffff' && color !== '#ffffff' ? '1px solid #ccc' : '' }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {note ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
