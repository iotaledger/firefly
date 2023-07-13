import { Address, AddressType, AliasAddress, Ed25519Address, NftAddress } from '@iota/wallet'

export function getHexAddressFromAddressTypes(address: Address): string {
    switch (address?.getType()) {
        case AddressType.Ed25519:
            return (address as Ed25519Address).getPubKeyHash()
        case AddressType.Alias:
            return (address as AliasAddress).getAliasId()
        case AddressType.Nft:
            return (address as NftAddress).getNftId()
    }
}
