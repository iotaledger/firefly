export function getIPFSHash(url?: string): string | undefined {
    const ipfsPrefix = 'https://ipfs.io'

    if (url?.includes(ipfsPrefix)) {
        return url.slice(ipfsPrefix.length)
    }
}
