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
    const urlRegex = /((https?|ftp|file):\/\/)?([\da-z-]+\.)+([a-z]{2,6})([/\w .-]*)*\/?$/gi
    const containsUrl = urlRegex.test(name) || urlRegex.test(parsedName) || urlRegex.test(parsedDescription)
    // Note: in order to avoid issues with the translations, we are using a hardcoded string here
    const WARNING_MESSAGE =
        'Be careful when following unknown links. Never share your private keys, nor enter them into any websites or services.    '
    return containsUrl ? WARNING_MESSAGE : undefined
}
