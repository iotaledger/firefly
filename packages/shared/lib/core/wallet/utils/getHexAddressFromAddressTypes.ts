import type { AddressTypes } from '@iota/types'

import { ADDRESS_TYPE_ALIAS, ADDRESS_TYPE_ED25519, ADDRESS_TYPE_NFT } from '../constants'

export function getHexAddressFromAddressTypes(address: AddressTypes): string {
    switch (address?.type) {
        case ADDRESS_TYPE_ED25519:
            return address.pubKeyHash
        case ADDRESS_TYPE_ALIAS:
            return address.aliasId
        case ADDRESS_TYPE_NFT:
            return address.nftId
    }
}
