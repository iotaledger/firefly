import { derived, Readable, Writable, writable } from 'svelte/store'

import { INft } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'
import { time } from '@core/app/stores/time.store'
import { selectedWalletId } from '@core/wallet/stores/selected-wallet-id.store'

// TODO(2.0) Rename this
export const selectedAccountNfts: Readable<INft[]> = derived(
    [selectedWalletId, allAccountNfts],
    ([$selectedWalletId, $allAccountNfts]) => {
        if ($selectedWalletId) {
            return $allAccountNfts[$selectedWalletId] ?? []
        } else {
            return []
        }
    }
)

export const ownedNfts: Readable<INft[]> = derived([selectedAccountNfts, time], ([$selectedAccountNfts, $time]) =>
    $selectedAccountNfts.filter((nft) => nft.isSpendable || nft.timelockTime > $time.getTime())
)

export const nftSearchTerm: Writable<string> = writable('')

export const queriedNfts: Readable<INft[]> = derived([ownedNfts, nftSearchTerm], ([$ownedNfts, $nftSearchTerm]) => {
    let nftList = $ownedNfts

    if ($nftSearchTerm) {
        nftList = nftList.filter((nft) => nft.name.toLowerCase().includes($nftSearchTerm.toLowerCase()))
    }

    return nftList.sort((nft1, nft2) => (nft2.name.toLowerCase() < nft1.name.toLowerCase() ? 1 : -1))
})
