import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${note.title}</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
                    h1 { border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>${note.title}</h1>
                ${note.body}
            </body>
            </html>
        `], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `${note.title}.html`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
        document.body.removeChild(element);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!note) return <div className="error">Note not found</div>;

    return (
        <div className="note-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={handleDownload} className="btn btn-secondary">Download</button>
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
                <div className="note-meta">
                    <span>{new Date(note.updatedAt).toLocaleString()}</span>
                    <span>{note.folder}</span>
                </div>
                <div className="note-content" dangerouslySetInnerHTML={{ __html: note.body }} />
            </article>
        </div>
    );
}

export default NoteView;
