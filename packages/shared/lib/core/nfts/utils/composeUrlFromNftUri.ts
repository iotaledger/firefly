import { cleanUrl } from '@core/utils'
import { rewriteIpfsUri } from './rewriteIpfsUri'

export function composeUrlFromNftUri(uri: string): string {
    if (!uri) {
        return undefined
    }

    const url = new URL(uri)
    let newUrl

    switch (url.protocol) {
        case 'http:':
            newUrl = uri.replace('http:', 'https:')
            break
        case 'https:':
            newUrl = uri
            break
        case 'ipfs:':
            newUrl = rewriteIpfsUri(uri)
            break
        default:
            return undefined
    }

    return cleanUrl(newUrl)
}
