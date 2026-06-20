import React, { useContext } from 'react';
import { NoteContext } from '../context/NoteContext';
import { FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const NoteCard = ({ note, onEdit }) => {
  const { deleteNote, togglePin } = useContext(NoteContext);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note._id);
    }
  };

  const handlePin = (e) => {
    e.stopPropagation();
    togglePin(note._id, note.isPinned);
  };

  // Determine text color based on background
  const getTextColor = (bgColor) => {
    return bgColor === '#ffffff' ? '#1e293b' : '#000000';
  };

  return (
    <div 
      className="note-card" 
      style={{ backgroundColor: note.color, color: getTextColor(note.color) }}
      onClick={onEdit}
    >
      <div className="note-title">
        <span style={{ flex: 1, paddingRight: '8px' }}>{note.title}</span>
        <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
          <div 
            className={`pin-icon ${note.isPinned ? 'pinned' : ''}`} 
            onClick={handlePin}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            {note.isPinned ? <FaStar color="#fbbf24" /> : <FiStar />}
          </div>
          <div className="pin-icon" onClick={handleDelete} title="Delete note">
            <FiTrash2 />
          </div>
        </div>
      </div>
      <div className="note-content">
        {note.content}
      </div>
    </div>
  );
};

export default NoteCard;
