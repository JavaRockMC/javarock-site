import express from 'express';
import path from 'path';
import Logger from './utils/logger.server';
//import { nanoid } from 'nanoid';

import {
    MAIN_PORT,
    ALT_PORT
} from './constants.server'

const app = express();
const errorLogger = new Logger(path.join(__dirname, ".", "logs", "errors.log"), { dateAsEpoch: false });
const requestLogger = new Logger(path.join(__dirname, ".", "logs", "requests.log"), { dateAsEpoch: false });

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/test/stats.html', (req, res) => {
    requestLogger.log(`GET request received from ${req.socket.remoteAddress} | Location: "/api/test/stats.html"`)
    res.send("There's nothing here")
})

app.listen(MAIN_PORT, async () => {
    console.log(`App is listening on main port ${MAIN_PORT}`);
}).on('error', (err) => {
    errorLogger.log((err as unknown) as string)

    if (err.message.includes("EADDRINUSE")) {
        app.listen(ALT_PORT, () => {
            console.log(`App is listening on alternative port ${ALT_PORT}`);
        })
    }

})