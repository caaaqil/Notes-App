import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import NoteView from './components/NoteView';

function App() {
    return (
        <Router>
            <div className="app-container">
                <nav className="navbar">
                    <Link to="/" className="nav-logo">Notes App</Link>
                    <Link to="/new" className="btn btn-primary">New Note</Link>
                </nav>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<NoteList />} />
                        <Route path="/new" element={<NoteForm />} />
                        <Route path="/note/:id" element={<NoteView />} />
                        <Route path="/edit/:id" element={<NoteForm />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
