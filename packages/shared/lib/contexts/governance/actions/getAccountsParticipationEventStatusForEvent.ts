import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet'
import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
import { IAccount } from '@core/account'
import { addOrUpdateProposalToRegisteredProposals, registeredProposalsForSelectedAccount } from '@contexts/governance'

export async function getAccountsParticipationEventStatusForEvent(
    eventId: ParticipationEventId,
    account: IAccount = get(selectedAccount)
): Promise<ParticipationEventStatus> {
    try {
        const status = await account?.getParticipationEventStatus(eventId)
        return status
    } catch (err) {
        /* eslint-disable no-console */
        console.error(err)
        /* eslint-disable no-constant-condition */
        if (true) {
            const proposal = get(registeredProposalsForSelectedAccount)[eventId]
            console.log(proposal)
            addOrUpdateProposalToRegisteredProposals({ ...proposal, isNodeOutdated: true }, get(selectedAccountIndex))
        }
        return undefined
    }
}
