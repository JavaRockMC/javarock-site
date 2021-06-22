import fs from 'fs'
import util from 'util';
import EventEmitter from 'events';
import * as stream from 'stream';
import { nanoid } from 'nanoid';

const finished = util.promisify(stream.finished);

export default class Logger extends EventEmitter {
    private file: string;
    private dateAsEpoch: boolean;
    private includeUniqueIdentifier: boolean;
    private uniqueIdentifierLength: number;
    constructor(file: string, {
        dateAsEpoch = true,
        includeUniqueIdentifier = true,
        uniqueIdentifierLength = 15
    }: { dateAsEpoch?: boolean; includeUniqueIdentifier?: boolean; uniqueIdentifierLength?: number; } = {}) {
        super()
        this.file = file;
        this.dateAsEpoch = dateAsEpoch;
        this.includeUniqueIdentifier = includeUniqueIdentifier;
        this.uniqueIdentifierLength = uniqueIdentifierLength;
    }

    /**
     * Send a message to a preset log file.
     * @param {string} message - Message to send.
     */
    public async log(message: string): Promise<void> {
        const writeStream: fs.WriteStream = fs.createWriteStream(this.file, { encoding: 'utf8' });
        let fullMessage: string = `LOGGED AT ${this.dateAsEpoch ? Date.now() : new Date()}: ${message}`

        if (this.includeUniqueIdentifier) {
            fullMessage += ` | ID: ${nanoid(this.uniqueIdentifierLength)}`;
        }

        this.emit('message', fullMessage);

        for await (const char of fullMessage) {
            if (!writeStream.write(char)) {
                await EventEmitter.once(writeStream, 'drain');
            }
        }

        writeStream.end();
        await finished(writeStream);
    }

    /**
     * Link two Logger instances together. When a message is sent to the original class instance .pipe() was called on, that message is sent to the second Logger as well.
     * @param {Logger} logger Instance of Logger class to send messages to.
     */
    public async pipe(logger: Logger): Promise<this> {
        return this.on('message', (msg) => {
            logger.log(msg);
        })
    }

    /**
     * Detaches all Loggers from this instance
     * @returns this
     */
    public detachAll(): this {
        return this.removeAllListeners('message');
    }
}