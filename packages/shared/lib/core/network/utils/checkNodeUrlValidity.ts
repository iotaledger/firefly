import { isValidHttpsUrl, isValidUrl } from '@core/utils'
import { INode } from '../interfaces'

/**
 * Check if a node's URL is valid.
 *
 * @method checkNodeUrlValidity
 * @param {INode[]} nodesList list of current nodes
 * @param {string} newUrl new URL candidate
 * @param {boolean} allowInsecure allows for connecting via plain HTTP
 * @returns {string | undefined}
 */
export function checkNodeUrlValidity(
    nodesList: INode[] | undefined,
    newUrl: string,
    allowInsecure: boolean
): string | undefined {
    if (!isValidUrl(newUrl)) {
        return 'error.node.invalid'
    }

    if (!allowInsecure && !isValidHttpsUrl(newUrl)) {
        return 'error.node.https'
    }

    const hasDefaultHttpsPort = newUrl.endsWith(':443')
    if (hasDefaultHttpsPort) {
        newUrl = newUrl.slice(0, -4)
    }

    /* eslint-disable @typescript-eslint/prefer-regexp-exec */
    if (nodesList && nodesList.some(({ url }) => (url.endsWith(':443') ? url.slice(0, -4) : url).match(newUrl))) {
        return 'error.node.duplicate'
    }

    return undefined
}
