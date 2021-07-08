// @ts-nocheck

const argv = process.argv;

function getFinalPorts(args) {
    const separator = "@@@@@"
    const joined = args.join(separator);
    const ports = joined.match(/(-P).*/)[0];

    if (ports) {
        const allPorts = ports.split(separator).slice(1);
        return allPorts;
    }

    return [];
}

getFinalPorts(argv)