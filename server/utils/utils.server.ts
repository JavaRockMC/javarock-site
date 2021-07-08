import * as types from '../types/types';

export function getExtraPorts(args: string[]): string[] {
    const separator = "@@@@@"
    const joined: string = args.join(separator) || "";
    const matched: types.matchResults = joined.match(/(-P).*/);
    const ports = matched ? matched[0] : null;

    if (ports) {
        const allPorts = ports.split(separator).slice(1);
        return allPorts;
    }

    return [];
}