export const megabytesToBytes = (mb: number) => Math.floor(mb * 1024 * 1024);

export function bytesToHuman (bytes: number): string {
    if (bytes === 0) {
        return '0 kB';
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Number((bytes / Math.pow(1024, i)).toFixed(2))} ${[ 'Bytes', 'kB', 'MB', 'GB', 'TB' ][i]}`;
}

export function megabytesToHuman (mb: number): string {
    return bytesToHuman(megabytesToBytes(mb));
}

export const randomInt = (low: number, high: number) => Math.floor(Math.random() * (high - low) + low);

export const cleanDirectoryPath = (path: string) => path.replace(/(\/(\/*))|(^$)/g, '/');

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export function fileBitsToString (mode: string, directory: boolean): string {
    const m = parseInt(mode, 8);

    let buf = '';
    'dalTLDpSugct?'.split('').forEach((c, i) => {
        if ((m & (1 << (32 - 1 - i))) !== 0) {
            buf = buf + c;
        }
    });

    if (buf.length === 0) {
        // If the file is directory, make sure it has the directory flag.
        if (directory) {
            buf = 'd';
        } else {
            buf = '-';
        }
    }

    'rwxrwxrwx'.split('').forEach((c, i) => {
        if ((m & (1 << (9 - 1 - i))) !== 0) {
            buf = buf + c;
        } else {
            buf = buf + '-';
        }
    });

    return buf;
}

/**
 * URL-encodes the segments of a path.
 * This allows to use the path as part of a URL while preserving the slashes.
 * @param path the path to encode
 */
export function encodePathSegments (path: string): string {
    return path.split('/').map(s => encodeURIComponent(s)).join('/');
}

export function hashToPath (hash: string): string {
    return hash.length > 0 ? decodeURIComponent(hash.substr(1)) : '/';
}

export function formatIp (ip: string): string {
    return /([a-f0-9:]+:+)+[a-f0-9]+/.test(ip) ? `[${ip}]` : ip;
}

// Store old values to compare to new values for network speed.
export let oldBytesReceived = 0;
export let oldBytesSent = 0;
export let oldBytesReceivedChart = 0;
export let oldBytesSentChart = 0;

export function setOldNetworkValues (bytesReceived: number, bytesSent: number, chart: boolean | null): void {
    if (chart === true && chart !== null) {
        oldBytesReceivedChart = bytesReceived;
        oldBytesSentChart = bytesSent;
    } else {
        oldBytesReceived = bytesReceived;
        oldBytesSent = bytesSent;
    }
}

// Convert bytes to bits per second (bps) by comparing to old values.
export function bytesToBps (bytesReceived: number, bytesSent: number, chart: boolean | null): number {
    const bpsReceived = (bytesReceived - (chart === true ? oldBytesReceivedChart : oldBytesReceived)) * 8;
    const bpsSent = (bytesSent - (chart === true ? oldBytesSentChart : oldBytesSent)) * 8;

    setOldNetworkValues(bytesReceived, bytesSent, chart);

    return bpsReceived + bpsSent;
}

// Convert bits per second (bps) to human-readable format.
export function bpsToHuman (bps: number): string {
    if (bps < 1000) {
        return `${bps} bps`;
    }

    if (bps < 1000000) {
        return `${(bps / 1000).toFixed(2)} kbps`;
    }

    if (bps < 1000000000) {
        return `${(bps / 1000000).toFixed(2)} mbps`;
    }

    return `${(bps / 1000000000).toFixed(2)} gbps`;
}
