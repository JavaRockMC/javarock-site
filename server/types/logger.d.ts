export interface LoggerConstructorOptions {
    verbose: Function;
    dateAsEpoch: boolean;
    includeUniqueIdentifier: boolean;
    uniqueIdentifierLength?: number;
}