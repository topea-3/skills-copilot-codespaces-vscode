// Create web server
// Load in the comments array
// Create a route for POST /api/comments
// Create a route for GET /api/comments
// Create a route for DELETE /api/comments/:id

const express = require('express');
const app = express();
const fs = require('fs');

const comments = require('./comments.json');

app.use(express.json());

app.post('/create', (req, res) => {
    const { name, comment } = req.body;

    if (!name || !comment) {
        return res.status(400).json({ message: 'Name and comment are required' });
    }

    const id = comments.length + 1;
    comments.push({ id, name, comment });

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Something went wrong' });
        }

        res.status(201).json({ id, name, comment });
    });
});

app.get('/', (_req, res) => {
    res.status(200).json(comments);
});

app.delete('/:id/delete', (req, res) => {
    const id = req.params.id;
    const comment = comments.find((comment) => comment.id === parseInt(id));

    if (!comment) {
        return res.status(404).json({ message: `Comment with id ${id} not found` });
    }

    const index = comments.indexOf(comment);
    comments.splice(index, 1);

    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Something went wrong' });
        }

        res.status(200).json({ message: `Comment with id ${id} deleted` });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});