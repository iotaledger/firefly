import { api } from '@core/profile-manager'
import { Address, AddressType, AliasAddress, Ed25519Address, NftAddress } from '@iota/sdk/out/types'
import { getNetworkHrp } from '@core/profile'

export function getBech32AddressFromAddressTypes(address: Address): string {
    const hrp = getNetworkHrp()
    switch (address.type) {
        case AddressType.Ed25519:
            return api.hexToBech32((address as Ed25519Address).pubKeyHash, hrp)
        case AddressType.Alias:
            return api.aliasIdToBech32((address as AliasAddress).aliasId, hrp)
        case AddressType.Nft:
            return api.nftIdToBech32((address as NftAddress).nftId, hrp)
    }
}
