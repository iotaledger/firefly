import { localize } from '../../i18n'
import { INft } from '../interfaces'

/**
 * Check if an NFT is flagged as a potential scam
 * @param nft The NFT to check
 * @returns True if the NFT is flagged
 */
export function isFlaggedNft(nft: INft): string | undefined {
    const name = nft.name ?? ''
    const parsedMetadata = nft.parsedMetadata
    const parsedName = parsedMetadata?.name ?? ''
    const parsedDescription = parsedMetadata?.description ?? ''
    const urlRegex = new RegExp(
        '\\b(?:https?:\\/\\/)?[a-zA-Z0-9-]+(?:[\\.\\u2024\\uFE52\\uFF0E\\uFF61][a-zA-Z0-9-]+)+\\b(?:[\\/\\?#][^\\s()<>]*)?',
        'i'
    )
    const containsUrl = urlRegex.test(name) || urlRegex.test(parsedName) || urlRegex.test(parsedDescription)

    if (containsUrl) {
        return localize('warning.nft.flagged')
    }
}
