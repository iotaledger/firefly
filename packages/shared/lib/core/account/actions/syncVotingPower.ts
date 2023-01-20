import { get } from 'svelte/store'
import { selectedAccountIndex, updateSelectedAccount } from '../stores'
import { getVotingPower } from '../api/getVotingPower'
import { updateActiveAccount } from '@core/profile'

export async function syncVotingPower(accountIndex = get(selectedAccountIndex)): Promise<void> {
    const votingPower = await getVotingPower(accountIndex)
    if (get(selectedAccountIndex) === accountIndex) {
        updateSelectedAccount({ votingPower })
    } else {
        updateActiveAccount(accountIndex, { votingPower })
    }
    return
}
