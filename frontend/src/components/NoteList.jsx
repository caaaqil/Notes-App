import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getNotes, getFolders } from '../api/notes';

function NoteList() {
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalPages, setTotalPages] = useState(1);

    const page = parseInt(searchParams.get('page') || '1');
    const folder = searchParams.get('folder') || '';
    const q = searchParams.get('q') || '';

    useEffect(() => {
        fetchFolders();
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [page, folder, q]);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await getNotes({ page, folder, q });
            setNotes(res.data.notes);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setError('Failed to load notes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFolders = async () => {
        try {
            const res = await getFolders();
            setFolders(res.data);
        } catch (err) {
            console.error('Failed to load folders', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.target;
        const query = form.search.value;
        setSearchParams({ q: query, folder, page: 1 });
    };

    const handleFolderChange = (e) => {
        setSearchParams({ q, folder: e.target.value, page: 1 });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ q, folder, page: newPage });
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <div className="filters">
                <form onSubmit={handleSearch} style={{ flex: 1 }}>
                    <input
                        name="search"
                        defaultValue={q}
                        placeholder="Search notes..."
                        className="form-control"
                    />
                </form>
                <select value={folder} onChange={handleFolderChange} className="form-control" style={{ width: '200px' }}>
                    <option value="">All Folders</option>
                    {folders.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>

            <div className="note-list">
                {notes.map(note => (
                    <Link key={note._id} to={`/note/${note._id}`} className="note-card">
                        <h3>{note.title}</h3>
                        <div className="note-meta">
                            <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            {' • '}
                            <span>{note.folder}</span>
                        </div>
                    </Link>
                ))}
                {notes.length === 0 && <p style={{ textAlign: 'center' }}>No notes found.</p>}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page <= 1}
                        onClick={() => handlePageChange(page - 1)}
                        className="btn btn-secondary"
                    >
                        Previous
                    </button>
                    <span style={{ alignSelf: 'center' }}>Page {page} of {totalPages}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        className="btn btn-secondary"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default NoteList;
