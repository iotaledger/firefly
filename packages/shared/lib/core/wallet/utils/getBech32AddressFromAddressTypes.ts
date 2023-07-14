import { convertHexAddressToBech32 } from './convertHexAddressToBech32'
import { ADDRESS_TYPE_ALIAS, ADDRESS_TYPE_ED25519, ADDRESS_TYPE_NFT } from '../constants'
import { Address, AddressType, AliasAddress, Ed25519Address, NftAddress } from '@iota/wallet'

export function getBech32AddressFromAddressTypes(address: Address): string | undefined {
    switch (address?.getType()) {
        case AddressType.Ed25519:
            return convertHexAddressToBech32(ADDRESS_TYPE_ED25519, (address as Ed25519Address).getPubKeyHash())
        case AddressType.Alias:
            return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, (address as AliasAddress).getAliasId())
        case AddressType.Nft:
            return convertHexAddressToBech32(ADDRESS_TYPE_NFT, (address as NftAddress).getNftId())
    }
}
