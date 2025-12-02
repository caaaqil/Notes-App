import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getNote, deleteNote } from '../api/notes';

function NoteView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchNote();
    }, [id]);

    const fetchNote = async () => {
        try {
            const res = await getNote(id);
            setNote(res.data);
        } catch (err) {
            setError('Failed to load note');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteNote(id);
            navigate('/');
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="error">Note not found</div>;

    return (
        <div className="note-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/edit/${id}`} className="btn btn-primary">Edit</Link>
                    <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger">Delete</button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
                        <h3>Delete Note?</h3>
                        <p>Are you sure you want to delete "{note.title}"? This action cannot be undone.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">Cancel</button>
                            <button onClick={handleDelete} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <article>
                <h1 style={{ marginBottom: '5px' }}>{note.title}</h1>
                <div className="note-meta" style={{ marginBottom: '20px' }}>
                    <span>{note.folder}</span> • <span>{new Date(note.updatedAt).toLocaleString()}</span>
                </div>
                <div style={{ lineHeight: '1.6', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <ReactMarkdown>{note.body}</ReactMarkdown>
                </div>
            </article>
        </div>
    );
}

export default NoteView;
