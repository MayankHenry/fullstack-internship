import React, { useEffect, useContext, useState } from 'react';
import { NoteContext } from '../context/NoteContext';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import { FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { notes, loading, fetchNotes } = useContext(NoteContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    fetchNotes(searchTerm, colorFilter);
  }, [fetchNotes, searchTerm, colorFilter]);

  const handleCreateNew = () => {
    setCurrentNote(null);
    setIsModalOpen(true);
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setIsModalOpen(true);
  };

  const colors = ['#ffffff', '#fecaca', '#fde68a', '#a7f3d0', '#bfdbfe', '#e9d5ff'];

  return (
    <div className="container">
      <div className="toolbar glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="input-field search-input"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 0, minWidth: '250px' }}
        />
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter:</span>
          <div className="color-circle" 
               style={{ background: 'transparent', border: colorFilter === '' ? '2px solid white' : '1px dashed #666' }}
               onClick={() => setColorFilter('')} title="All Colors" />
          {colors.map(color => (
            <div 
              key={color} 
              className={`color-circle ${colorFilter === color ? 'selected' : ''}`}
              style={{ background: color }}
              onClick={() => setColorFilter(color)}
            />
          ))}
        </div>

        <button className="btn btn-primary" onClick={handleCreateNew} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FiPlus /> New Note
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '48px' }}>Loading notes...</div>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)', padding: '48px' }}>
              No notes found. Create one!
            </div>
          ) : (
            notes.map(note => (
              <NoteCard key={note._id} note={note} onEdit={() => handleEdit(note)} />
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <NoteModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          note={currentNote} 
        />
      )}
    </div>
  );
};

export default Dashboard;
