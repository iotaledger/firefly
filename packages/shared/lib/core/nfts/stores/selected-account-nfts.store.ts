import { derived, Readable, Writable, writable } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'

import { INft } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'

export const selectedAccountNfts: Readable<INft[]> = derived(
    [selectedAccount, allAccountNfts],
    ([$selectedAccount, $allAccountNfts]) => {
        if (selectedAccount) {
            return $allAccountNfts[$selectedAccount?.index]?.filter((nft) => nft.isSpendable) ?? []
        } else {
            return []
        }
    }
)

export const nftSearchTerm: Writable<string> = writable('')

export const queriedNfts: Readable<INft[]> = derived(
    [selectedAccountNfts, nftSearchTerm],
    ([$selectedAccountNfts, $nftSearchTerm]) => {
        let nftList = $selectedAccountNfts

        if ($nftSearchTerm) {
            nftList = nftList.filter((nft) => nft.name.toLowerCase().includes($nftSearchTerm.toLowerCase()))
        }

        return nftList.sort((nft1, nft2) => (nft2.name.toLowerCase() < nft1.name.toLowerCase() ? 1 : -1))
    }
)
