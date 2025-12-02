import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNote, updateNote, getFolders } from '../api/notes';

function NoteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: '', body: '', folder: '' });
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFolders();
        if (id) {
            fetchNote();
        }
    }, [id]);

    const fetchNote = async () => {
        try {
            const res = await getNote(id);
            setFormData({
                title: res.data.title,
                body: res.data.body,
                folder: res.data.folder
            });
        } catch (err) {
            setError('Failed to load note');
        }
    };

    const fetchFolders = async () => {
        try {
            const res = await getFolders();
            setFolders(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateNote(id, formData);
            } else {
                await createNote(formData);
            }
            navigate('/');
        } catch (err) {
            setError('Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="note-form">
            <h2>{id ? 'Edit Note' : 'New Note'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Note Title"
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        name="folder"
                        value={formData.folder}
                        onChange={handleChange}
                        placeholder="Folder (e.g. Work, Ideas)"
                        list="folders-list"
                        className="form-control"
                    />
                    <datalist id="folders-list">
                        {folders.map(f => <option key={f} value={f} />)}
                    </datalist>
                </div>
                <div className="form-group">
                    <textarea
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        placeholder="Write your note in markdown..."
                        className="form-control"
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? 'Saving...' : 'Save Note'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NoteForm;
