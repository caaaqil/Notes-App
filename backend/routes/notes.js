const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// GET /api/notes - List notes with pagination, search, and folder filter
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, folder, q } = req.query;
        const query = {};

        if (folder) {
            query.folder = folder;
        }

        if (q) {
            query.$or = [
                { title: { $regex: q, $options: 'i' } },
                { body: { $regex: q, $options: 'i' } }
            ];
        }

        const notes = await Note.find(query)
            .sort({ updatedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Note.countDocuments(query);

        res.json({
            notes,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/notes/:id - Get single note
router.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/notes - Create new note
router.post('/', async (req, res) => {
    const { title, body, folder } = req.body;

    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
    }

    const note = new Note({
        title,
        body,
        folder: folder || 'General'
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/notes/:id - Update note
router.put('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        if (req.body.title != null) note.title = req.body.title;
        if (req.body.body != null) note.body = req.body.body;
        if (req.body.folder != null) note.folder = req.body.folder;

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/notes/:id - Delete note
router.delete('/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/folders - List all unique folders
router.get('/folders/list', async (req, res) => {
    try {
        const folders = await Note.distinct('folder');
        res.json(folders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
