import fs from 'fs'
import util from 'util';
import * as stream from 'stream';
import { nanoid } from 'nanoid';
import { once } from 'events';

const finished = util.promisify(stream.finished);

export default class Logger {
    file: string;
    dateAsEpoch: boolean;
    includeUniqueIdentifier: boolean;
    uniqueIdentifierLength: number;
    constructor(file: string, {
        dateAsEpoch = true,
        includeUniqueIdentifier = true,
        uniqueIdentifierLength = 15
    }: { dateAsEpoch?: boolean; includeUniqueIdentifier?: boolean; uniqueIdentifierLength?: number; } = {}) {
        this.file = file;
        this.dateAsEpoch = dateAsEpoch;
        this.includeUniqueIdentifier = includeUniqueIdentifier;
        this.uniqueIdentifierLength = uniqueIdentifierLength;
    }

    async log(message: string): Promise<void> {
        const writeStream: fs.WriteStream = fs.createWriteStream(this.file, { encoding: 'utf8' });
        let fullMessage: string = `LOGGED AT ${this.dateAsEpoch ? Date.now() : new Date()}: ${message}`

        if (this.includeUniqueIdentifier) {
            fullMessage += ` | ID: ${nanoid(this.uniqueIdentifierLength)}}`;
        }

        for await (const char of fullMessage) {
            if (!writeStream.write(char)) {
                await once(writeStream, 'drain');
            }
        }

        writeStream.end();
        await finished(writeStream);
    }
}