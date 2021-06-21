import express from 'express';
import path from 'path';
import Logger from './utils/logger';
import { nanoid } from 'nanoid';

import {
    MAIN_PORT,
    ALT_PORT
} from './constants'

const app = express();
const errorLogger = new Logger(path.join(__dirname, ".", "logs", "errors.log"))

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', (req, res) => {
    res.json('L')
})

try {
    app.listen(MAIN_PORT, () => {
        console.log(`App is listening on main port ${MAIN_PORT}`);
    })
} catch (e) {
    errorLogger.log(e as string);
    app.listen(ALT_PORT, () => {
        console.log(`App is listening on alternative port ${ALT_PORT}`);
    })
}