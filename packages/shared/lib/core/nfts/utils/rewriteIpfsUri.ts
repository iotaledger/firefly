export function rewriteIpfsUri(ipfsUri: string): string {
    const url = new URL(ipfsUri)

    return 'https://ipfs.io/ipfs/' + url.pathname.replace('//', '')
}
