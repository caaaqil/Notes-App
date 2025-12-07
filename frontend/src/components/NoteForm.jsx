import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createNote, getNote, updateNote, getFolders } from '../api/notes';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

    const handleBodyChange = (value) => {
        setFormData({ ...formData, body: value });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension

            setFormData({
                ...formData,
                title: formData.title || fileName,
                body: content
            });
        };
        reader.readAsText(file);
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="note-form">
            <h2>{id ? 'Edit Note' : 'New Note'}</h2>
            {error && <div className="error">{error}</div>}

            {!id && (
                <div className="file-upload-section">
                    <label htmlFor="file-upload" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-block' }}>
                        📁 Import from File
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.md,.markdown"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-700)', marginTop: '0.5rem' }}>
                        Upload a .txt or .md file to import its contents
                    </p>
                </div>
            )}

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
                    <ReactQuill
                        theme="snow"
                        value={formData.body}
                        onChange={handleBodyChange}
                        modules={modules}
                        placeholder="Write your note..."
                        style={{ height: '300px', marginBottom: '50px' }}
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
