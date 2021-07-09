import express from 'express';
import path from 'path';
import Logger from './utils/logger.server';
import { nanoid } from 'nanoid';

import {
    MAIN_PORT,
    ALT_PORT
} from './constants.server'

const app = express();
const errorLogger = new Logger("Error Logger", path.join(__dirname, ".", "logs", "errors.log"), { dateAsEpoch: false, includeUniqueIdentifier: true });
const requestLogger = new Logger("Request Logger", path.join(__dirname, ".", "logs", "requests.log"), { dateAsEpoch: false, includeUniqueIdentifier: true });

let portsUsed: number[] = [];

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test/stats.html', (req, res) => {
    requestLogger.log(`GET request received from ${req.socket.remoteAddress} | Location: "/api/test/stats.html"`)
    res.send("Hello world")
})

app.get('/html/home.html', (req, res) => {
    requestLogger.log(`GET request received from ${req.socket.remoteAddress} | Location: "/html/home.html"`)
})

app.listen(MAIN_PORT, async () => {
    console.log(`App is listening on main port ${MAIN_PORT}`);
    portsUsed.push(MAIN_PORT)
}).on('error', (err) => {
    errorLogger.log((err as unknown) as string);

    if (err.message.includes("EADDRINUSE") && !portsUsed.includes(ALT_PORT)) {
        app.listen(ALT_PORT, () => {
            console.log(`App is listening on alternative port ${ALT_PORT}`);
        })

        portsUsed.push(ALT_PORT);
    } else {
        console.log("Cannot listen on normal ports, falling back to final ports.")
    }

})