import { get } from 'svelte/store'
import { selectedAccount, updateSelectedAccount } from '../stores'
import { getVotingPower } from '../api/getVotingPower'
import { updateActiveAccount } from '@core/profile'

export async function syncVotingPower(accountIndex: number): Promise<void> {
    const votingPower = await getVotingPower(accountIndex)
    if (get(selectedAccount)?.index === accountIndex) {
        updateSelectedAccount({ votingPower })
    } else {
        updateActiveAccount(accountIndex, { votingPower })
    }
    return
}
