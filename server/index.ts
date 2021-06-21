import express from 'express';
import path from 'path';
import { nanoid } from 'nanoid';

import {
    MAIN_PORT,
    ALT_PORT
} from './constants'

const app = express();

app.use(express.static(path.join(__dirname, "..", "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try {
    app.listen(MAIN_PORT, () => {
        console.log(`App is listening on main port ${MAIN_PORT}`);
    })
} catch (e) {
    app.listen(ALT_PORT, () => {
        console.log(`App is listening on alternative port ${ALT_PORT}`);
    })
}