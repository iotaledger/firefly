import type { AddressTypes } from '@iota/types'

import { convertHexAddressToBech32 } from './convertHexAddressToBech32'
import { ADDRESS_TYPE_ALIAS, ADDRESS_TYPE_ED25519, ADDRESS_TYPE_NFT } from '../constants'

export function getBech32AddressFromAddressTypes(address: AddressTypes): string {
    switch (address?.type) {
        case ADDRESS_TYPE_ED25519:
            return convertHexAddressToBech32(ADDRESS_TYPE_ED25519, address.pubKeyHash)
        case ADDRESS_TYPE_ALIAS:
            return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, address.aliasId)
        case ADDRESS_TYPE_NFT:
            return convertHexAddressToBech32(ADDRESS_TYPE_NFT, address.nftId)
    }
}
