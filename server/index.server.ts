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

app.get("/home", (req, res) => {
    res.redirect("/");
})

app.use(express.static(path.join(PATH)));

// something something, heroku
const PORT = process.env.PORT || MAIN_PORT;
const PORT_ALT = process.env.PORT || ALT_PORT;

// i WANT to improve this, but i simply refuse to put the time needed into doing so
app.listen(PORT, async () => {
    console.log(`App is listening on main port ${PORT}`);
}).on('error', (err) => {

    if (err.message.includes("EADDRINUSE")) {
        app.listen(PORT_ALT, () => {
            console.log(`App is listening on alternative port ${PORT_ALT}`);
        })
    }

})