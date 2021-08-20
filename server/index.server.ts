import express from 'express';
import path from 'path';
import { nanoid } from 'nanoid';
import { PlayerStats, WorldStats } from './types/APITypes';

import {
    MAIN_PORT,
    ALT_PORT,
    PATH
} from './constants.server'

// todo: refactor
// can use arguments w express urls to shorten this
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/preview/home", (req, res) => {
    console.log('mmmm')
    res.send({ data: "string" })
})

app.get("/api/messages/:id", (req, res) => {
    const id = +req.params.id
    const headers = req.headers
    const authHeader = headers.authorization;
    if (id === 0) {
        // NOT permanent, only to be used while testing on localhost
        return res.status(200).json({ id: nanoid(8) })
    }

    if (id === 1) {
        if (authHeader) { }
    }
})

app.get("/", (req, res) => {
    res.sendFile(`${PATH}/html/index.html`)
})

app.post("/api/preview/home", (req, res) => {
    const body = req.body;
    console.log(body)
})

/*app.post("/api/messages/:id", (req, res) => {
    const id = req.params.id;

    if(!Number.parseInt(id)) {
        return res.status(403).send("Invalid ID");
    }

    //around here we'd verify that everything is fine
})*/

// for some ungodly reason this has to be after i've handled requests
app.use(express.static(path.join(PATH)));

const PORT = process.env.PORT || MAIN_PORT;
const PORT_ALT = process.env.PORT || ALT_PORT;

app.listen(PORT, async () => {
    console.log(`App is listening on main port ${PORT}`);
}).on('error', (err) => {

    if (err.message.includes("EADDRINUSE")) {
        app.listen(PORT_ALT, () => {
            console.log(`App is listening on alternative port ${PORT_ALT}`);
        })
    } else {
        console.log("All ports are currently occupied.")
    }

})