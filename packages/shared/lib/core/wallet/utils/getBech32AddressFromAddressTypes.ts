import { convertHexAddressToBech32 } from './convertHexAddressToBech32'
import { Address, AddressType, AliasAddress, Ed25519Address, NftAddress } from '@iota/wallet/out/types'

export function getBech32AddressFromAddressTypes(address: Address): string | undefined {
    switch (address.type) {
        case AddressType.Ed25519:
            return convertHexAddressToBech32(AddressType.Ed25519, (address as Ed25519Address).pubKeyHash)
        case AddressType.Alias:
            return convertHexAddressToBech32(AddressType.Alias, (address as AliasAddress).aliasId)
        case AddressType.Nft:
            return convertHexAddressToBech32(AddressType.Nft, (address as NftAddress).nftId)
    }
}
