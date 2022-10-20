import { derived, Readable } from 'svelte/store'
import { selectedAccount } from '../../account/stores/selected-account.store'
import { INftMetadata } from '../interfaces'
import { allAccountNfts } from './all-account-nfts.store'

export const selectedAccountNfts: Readable<INftMetadata[]> = derived(
    [selectedAccount, allAccountNfts],
    ([$selectedAccount, $allAccountNfts]) => {
        if (selectedAccount) {
            return $allAccountNfts[$selectedAccount?.index] ?? []
        } else {
            return []
        }
    }
)
