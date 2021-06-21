import fs from 'fs'
import util from 'util';
import * as stream from 'stream';
import { nanoid } from 'nanoid';
import { once } from 'events';
import { LoggerConstructorOptions } from "../types/logger";

const finished = util.promisify(stream.finished);

export class Logger {
    file: string;
    verbose: Function;
    dateAsEpoch: boolean;
    includeUniqueIdentifier: boolean;
    uniqueIdentifierLength: number = 15;
    constructor(file: string, { verbose = console.log, dateAsEpoch = true, includeUniqueIdentifier = true, uniqueIdentifierLength }: LoggerConstructorOptions) {
        this.file = file;
        this.verbose = verbose;
        this.dateAsEpoch = dateAsEpoch;
        this.includeUniqueIdentifier = includeUniqueIdentifier;

        if (uniqueIdentifierLength) {
            this.uniqueIdentifierLength = uniqueIdentifierLength;
        }
    }

    async log(message: string): Promise<void> {
        const writeStream: fs.WriteStream = fs.createWriteStream(this.file, { encoding: 'utf8' });
        let fullMessage: string = `LOGGED AT ${Date.now()}: ${message}`

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