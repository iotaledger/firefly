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
    const urlRegex = new RegExp('\\b(?:https?:\\/\\/)?[\\w-]+(?:\\.[\\w-]+)+(?:\\/[^\\s()<>]*)?', 'i')
    const containsUrl = urlRegex.test(name) || urlRegex.test(parsedName) || urlRegex.test(parsedDescription)

    if (containsUrl) {
        return localize('general.warning.nft.flagged')
    }
}
