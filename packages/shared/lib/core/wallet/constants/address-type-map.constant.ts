import { ADDRESS_LETTER_ALIAS, ADDRESS_LETTER_ED25519, ADDRESS_LETTER_NFT } from './address-letter.constants'
import { AddressType } from '@iota/sdk/out/types'

export const ADDRESS_TYPE_MAP = {
    [AddressType.Ed25519]: ADDRESS_LETTER_ED25519,
    [AddressType.Account]: ADDRESS_LETTER_ALIAS,
    [AddressType.Nft]: ADDRESS_LETTER_NFT,
}
