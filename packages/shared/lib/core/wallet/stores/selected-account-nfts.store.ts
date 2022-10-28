import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { IStoredNft } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'

export const selectedAccountNfts: Readable<IStoredNft[]> = derived(
    [selectedAccount, allAccountNfts],
    ([$selectedAccount, $allAccountNfts]) => {
        if (selectedAccount) {
            return $allAccountNfts[$selectedAccount?.index]?.filter((nft) => nft.isUnspent) ?? []
        } else {
            return []
        }
    }
)
