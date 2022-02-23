// Dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { json } = require('express/lib/response');

//Handling Asynchronous Processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//Setting Up Server
const app = express();
const PORT = process.env.Port || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

// Static Middleware
app.use(express.static("./develope/public"));

// API Route | "GET" request
app.get("/api/notes", (req, res) => {
    readFileAsync("./develop/db/db.json", "utf-8").then((data) => {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// API Route | "POST" request
app.post("/api/notes", (req, res) => {
    const note = req.body;
    readFileAsync("./develop/db/db.json", "utf-8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        notes.id = notes.length + 1
        notes.push(note);
        return notes
    }).then((notes) => {
        writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
        res.join(note);
    })
});

// API Route | "DELETE" request
app.delete("/api/notes/:id", (req, res) => {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf-8").then((data) => {
        const notes = [].concat(JSON.parse(data));
        const newNotesData = []
        for (let i = 0; i < notes.length; i++) {
            if (idToDelete !== notes[i].id) {
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then((notes) => {
        writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
        res.send('Saved Success!')
    })
})

//HTML Routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./develop/public/notes.html"))
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./develop/public/index.html"))
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./develop/public/index.html"))
});

// Listening
app.listen(PORT, () => {
    console.log("App listening on PORT" + PORT)
});