export function getIPFSHash(url?: string): string | undefined {
    const ipfsPrefix = 'ipfs'

    if (url?.includes(ipfsPrefix)) {
        return url.slice(ipfsPrefix.length)
    }
}
