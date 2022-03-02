// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const notes = require('./Develop/db/db.json');
const {v4: uuidv4} = require('uuid');
const { response } = require('express');

//Setting Up Server
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Static Middleware
app.use(express.static('Develop/public'));

// API Route | "GET" request
app.get("/api/notes", (req, res) => {
    JSON.stringify(res.sendFile(path.join(__dirname, 'Develop/db/db.json')))
});

//HTML Routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"))
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
});

app.post('/api/notes', (req, res) => {
    const createNote = req.body;
    createNote.id = uuidv4();

    let noteInfo = JSON.parse(fs.readFileSync('Develope/db/db.json', 'utf8'))

    noteInfo.push(createNote)
    fs.writeFileSync('Develope/db/db.json', JSON.stringify(noteInfo))
    res.json(noteInfo)
});

app.delete('/api/notes/:id', (req, res) => {
    let noteInfo = JSON.parse(fs.readFileSync('Develop/db/db.json', 'utf8'))
    let noteId = req.params.id;

    const noteIndex = noteInfo.map(note => note.id).indexOf(noteId)
    console.log(noteIndex);
    if (noteIndex >= 0) {
        noteInfo.splice(noteIndex, 1)
        console.log(noteInfo)
        fs.writeFileSync('Develop/db/db.json', JSON.stringify(noteInfo))
        res.json(noteInfo)
    }else {
        res.status(404).send({
            message: 'Note not found!'
        })
    }
})

// Listening
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});