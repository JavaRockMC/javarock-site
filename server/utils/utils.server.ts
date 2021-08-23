import { matchResults } from "../types/utilTypes"

export function getExtraPorts(args: string[]): string[] {
    const separator = "@@@@@"
    const joined: string = args.join(separator) || "";
    const matched: matchResults = joined.match(/(-P).*/);
    const ports = matched ? matched[0] : null;

    if (ports) {
        const allPorts = ports.split(separator).slice(1);
        return allPorts;
    }

    return [];
}

export function sleep(ms: number): Promise<boolean> {
    if (typeof ms !== "number") {
        throw TypeError("Expected argument to be of type 'number'");
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, ms)
    })
}