import express from 'express';
import path from 'path';
import Logger from './utils/logger.server';
import { nanoid } from 'nanoid';

import {
    MAIN_PORT,
    ALT_PORT
} from './constants.server'

// refactoring 
const app = express();
const errorLogger = new Logger("Error Logger", path.join(__dirname, ".", "logs", "errors.log"), { dateAsEpoch: false, includeUniqueIdentifier: true });
const requestLogger = new Logger("Request Logger", path.join(__dirname, ".", "logs", "requests.log"), { dateAsEpoch: false, includeUniqueIdentifier: true });

let portsUsed: number[] = [];

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '../src/public/html/index.html'))
})

app.get('/api/test/stats.html', (req, res) => {
    requestLogger.log(`GET request received from ${req.socket.remoteAddress} | Location: "/api/test/stats.html"`)
    res.send("Hello world")
})

const PORT = process.env.PORT || MAIN_PORT;
const PORT_ALT = process.env.PORT || ALT_PORT;

app.listen(PORT, async () => {
    console.log(`App is listening on main port ${PORT}`);
    portsUsed.push(MAIN_PORT)
}).on('error', (err) => {
    errorLogger.log((err as unknown) as string);

    if (err.message.includes("EADDRINUSE") && !portsUsed.includes(ALT_PORT)) {
        app.listen(PORT_ALT, () => {
            console.log(`App is listening on alternative port ${PORT_ALT}`);
        })

        portsUsed.push(ALT_PORT);
    } else {
        console.log("All ports are currently occupied.")
    }

})