import { AccountAddress, Address, AddressType, Ed25519Address, NftAddress } from '@iota/sdk/out/types'
import { getNetworkHrp } from '@core/profile'
import { api } from '@core/api'

export function getBech32AddressFromAddressTypes(address: Address): string {
    const hrp = getNetworkHrp()
    switch (address.type) {
        case AddressType.Ed25519:
            return api.hexToBech32((address as Ed25519Address).pubKeyHash, hrp)
        case AddressType.Account:
            return api.accountIdToBech32((address as AccountAddress).accountId, hrp)
        case AddressType.Nft:
            return api.nftIdToBech32((address as NftAddress).nftId, hrp)
    }
}
