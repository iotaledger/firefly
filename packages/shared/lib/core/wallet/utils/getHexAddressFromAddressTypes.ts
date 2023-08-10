import { Address, AddressType, AliasAddress, Ed25519Address, NftAddress } from '@iota/sdk/out/types'

export function getHexAddressFromAddressTypes(address: Address): string {
    switch (address?.type) {
        case AddressType.Ed25519:
            return (address as Ed25519Address).pubKeyHash
        case AddressType.Alias:
            return (address as AliasAddress).aliasId
        case AddressType.Nft:
            return (address as NftAddress).nftId
    }
}
