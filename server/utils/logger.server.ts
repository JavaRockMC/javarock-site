import EventEmitter from 'events';
import * as stream from 'stream';
import * as util from 'util'
import * as fs from 'fs';
import { nanoid } from 'nanoid'

const finished = util.promisify(stream.finished);

// Emit event to class instance when piping/unpiping and connecting/disconnecting?

class Logger extends EventEmitter {
    // Required constructor argument
    name;

    // Arrays used in class methods
    connected: any[] = [];
    _logged: string[] = [];
    _sent: string[] = []; // Any message sent to another instance through .connect()
    _forwarded: string[] = []; // Any message sent anywhere that isn't this using .pipe()
    _piped: any[] = [];

    // Vars
    file: string;
    _out?: stream.Writable;

    // Optional constructor arguments
    // Maybe include logToConsole property in real implementation?

    //logToConsole;
    maxConnected;
    includeCurrentDate;
    dateAsEpoch;
    includeUniqueIdentifier;
    uniqueIdentifierLength;

    constructor(name: string, file: string, {
        //logToConsole = true,
        maxConnected = 5,
        includeCurrentDate = false,
        dateAsEpoch = true,
        includeUniqueIdentifier = false,
        uniqueIdentifierLength = 10
    } = {}) {
        super()
        this.name = name;
        this.file = file;
        //this.logToConsole = logToConsole;
        this.maxConnected = maxConnected;
        this.includeCurrentDate = includeCurrentDate;
        this.dateAsEpoch = dateAsEpoch;
        this.includeUniqueIdentifier = includeUniqueIdentifier;
        this.uniqueIdentifierLength = uniqueIdentifierLength;
    }

    /**
     * Log a message.
     */
    async log(msg: string) {
        const date = (this.includeCurrentDate && this.dateAsEpoch) ? Date.now() : new Date();
        const id = nanoid(this.uniqueIdentifierLength);
        const writeStream = fs.createWriteStream(this.file, { encoding: "utf8" });

        let message: string = `\n${this.name}`;

        if (this.includeCurrentDate) {
            message += ` AT ${date}`;
        }

        message += `: ${msg}`;

        if (this.includeUniqueIdentifier) {
            message += ` | ID: ${id}`;
        }

        this._logged.push((message as unknown) as string);

        if (this._out) {
            this._out.write(message);
            this.emit('message', msg, "log");
            this.emit('logMessage', msg, message, date, id);

            return this;
        }

        for await (const char of message) {
            if (!writeStream.write(char)) {
                await EventEmitter.once(writeStream, 'drain');
            }
        }

        writeStream.end();
        await finished(writeStream);

        this.emit('message', msg, "log");
        this.emit('logMessage', msg, message, date, id)

        return this;
    }

    async warn(msg: string) {
        const date = (this.includeCurrentDate && this.dateAsEpoch) ? Date.now() : new Date();
        const id = nanoid(this.uniqueIdentifierLength);
        const writeStream = fs.createWriteStream(this.file, { encoding: "utf8" });

        let message = `\n${this.name} (WARNING)`;

        if (this.includeCurrentDate) {
            message += ` AT ${date}`;
        }

        message += `: ${msg}`;

        if (this.includeUniqueIdentifier) {
            message += ` | ID: ${id}`;
        }

        this._logged.push(message);

        for await (const char of message) {
            if (!writeStream.write(char)) {
                await EventEmitter.once(writeStream, 'drain');
            }
        }

        writeStream.end();
        await finished(writeStream);

        this.emit('message', msg, "warning");
        this.emit('warningMessage', msg, message, date, id);

        return this;
    }

    async error(msg: string) {
        const date = (this.includeCurrentDate && this.dateAsEpoch) ? Date.now() : new Date();
        const id = nanoid(this.uniqueIdentifierLength);
        const writeStream = fs.createWriteStream(this.file, { encoding: "utf8" });

        let message = `\nERR! ${this.name}`;

        if (this.includeCurrentDate) {
            message += ` AT ${date}`;
        }

        message += `: ${msg}`;

        if (this.includeUniqueIdentifier) {
            message += ` | ID: ${id}`;
        }

        this._logged.push(message);

        for await (const char of message) {
            if (!writeStream.write(char)) {
                await EventEmitter.once(writeStream, 'drain');
            }
        }

        writeStream.end();
        await finished(writeStream);

        this.emit('message', msg, "error");
        this.emit('errorMessage', msg, message, date, id);

        return this;
    }



    /**
     * Connect an instance to this one. If a message is sent that the given instance accepts, that instance will also log the message in the appropriate file.
     */
    connect(logger: this, callback: Function) {
        if (!(logger instanceof Logger)) {
            throw Error("Cannot connect instance to this.")
        }

        if (this.connected.length >= this.maxConnected) {
            throw Error("Cannot exceed max number of connectd instances.")
        }

        if (this.connected.filter(e => e.logger === logger).length > 0) {
            throw Error("Instance is already connectd.")
        }

        this.connected.push({ logger, callback });

        // Prevents unneeded listeners being added
        if (this.connected.length > 1) {
            return this;
        }

        return this.on('message', (msg: any) => {
            this.connected.forEach((i: any) => {
                const instance = i.logger;
                const cb = i.callback;

                if ((!cb) || (cb && cb(msg))) {
                    instance.log(msg)
                    if (!this._sent.includes(msg)) {
                        this._sent.push(msg);
                    }
                }
            })
        })
    }

    /**
     * Disconnect specific connected instances from this instance
     */
    disconnect(given: any) {
        if (typeof given === "number") {
            this.connected.splice(given, 1);
            return this;
        }

        const instance = this.connected.filter((e: any) => e.logger === given)[0];

        if (!instance) {
            throw Error("Instance is not connected.");
        }

        const index = this.connected.indexOf(instance);
        this.connected.splice(index, 1);

        return this;
    }

    /**
     * Disconnect all instances from this instance
     */
    disconnectAll() {
        this.connected = [];
        this.removeAllListeners();

        return this;
    }

    disconnectIf(callback: Function) {
        if (!callback) {
            throw Error("Callback expected as first argument.");
        }

        this.connected.forEach((instance, iter, arr) => {
            if (callback(instance, iter, arr)) {
                this.disconnect(iter);
            }
        })
    }

    getLoggedMessages(callback: Function) {
        if (!callback) {
            return this._logged;
        }

        return this._logged.filter(msg => {
            if (callback(msg)) {
                return msg;
            }
        })
    }

    getForwardedMessages(callback: Function) {
        if (!callback) {
            return this._sent;
        }

        return this._sent.filter(msg => {
            if (callback(msg)) {
                return msg;
            }
        })
    }

    enableAutomaticLogging(readableStream: stream.Readable, mode = 'log') {
        if (!readableStream.readable) {
            throw Error("Provide a readable stream as an argument");
        }

        if (!['log', 'warn', 'error'].some(e => mode === e)) {
            throw Error("Mode must be either 'log', 'warn', or 'error'");
        }

        readableStream.on('readable', () => {
            let data;

            while (null !== (data = readableStream.read())) {
                this.log(data);
            }
        })

        this.emit("autolog");
        return this;
    }

    streamTo(val: stream.Writable) {
        if (val === this._out) {
            return;
        }

        if (!val.write) {
            throw Error("Argument must be a WritableStream");
        }

        this._out = val;
    }
}

/*import fs from 'fs'
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
     *
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
     *
    public async pipe(logger: Logger, callback?: Function): Promise<this> {
        return this.on('message', (msg) => {
            if ((!callback) || (callback && callback(msg))) {
                logger.log(msg)
            }
        })
    }

    /**
     * Detaches all Loggers from this instance
     * @returns this
     *
    public unpipe(): this {
        return this.removeAllListeners('message');
    }
}*/