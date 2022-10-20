import { EMPTY_HEX_ID } from '@core/wallet/constants'
import { Blake2b } from '@iota/crypto.js'
import { Converter } from '@lib/converter'

export function getNftId(nftId: string, outputId: string): string {
    const isNewNft = nftId === EMPTY_HEX_ID
    const realNftId = isNewNft
        ? '0x' + Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId.substring(2))))
        : nftId
    return realNftId
}
