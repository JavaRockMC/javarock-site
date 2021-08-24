import express from 'express';
import path from 'path';
import glob from 'glob';
import { nanoid } from 'nanoid';
import { PlayerStats, WorldStats } from './types/APITypes';

// these imports suck, but i can't do anything about them right now
import worldIndex from './routes/api/world/index';
import playerIndex from './routes/api/players/index';
import statsIndex from './routes/api/stats/index';

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

// i'm not sure this can be avoided
app.use("/api/stats", statsIndex);
app.use("/api/world", worldIndex);
app.use("/api/players", playerIndex);

app.get("/", (req, res) => {
    res.sendFile(`${PATH}/html/index.html`)
})

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
    }

})


/*app.get("/api/preview/home", (req, res) => {
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

app.get("/api/players/:username", (req, res) => {
    if (!req.headers.authorization) {
        return res.redirect(`/stats/players/${req.params.username}`)
    }
})

app.post("/api/preview/home", (req, res) => {
    const body = req.body;
    console.log(body)
})*/