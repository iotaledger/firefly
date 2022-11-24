import { derived, Readable } from 'svelte/store'

import { selectedAccount } from '@core/account/stores'

import { INft } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'

export const selectedAccountNfts: Readable<INft[]> = derived(
    [selectedAccount, allAccountNfts],
    ([$selectedAccount, $allAccountNfts]) => {
        if (selectedAccount) {
            return $allAccountNfts[$selectedAccount?.index]?.filter((nft) => nft.isOwned) ?? []
        } else {
            return []
        }
    }
)
