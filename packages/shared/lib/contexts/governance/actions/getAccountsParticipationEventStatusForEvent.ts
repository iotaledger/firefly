import { get } from 'svelte/store'
import type { ParticipationEventId, ParticipationEventStatus } from '@iota/wallet'
import { selectedAccount, selectedAccountIndex } from '@core/account/stores'
import { IAccount } from '@core/account'
import {
    addOrUpdateProposalToRegisteredProposals,
    ProposalStatus,
    registeredProposalsForSelectedAccount,
} from '@contexts/governance'

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
        const isEventError = err?.error?.match(/(the requested data)|(was not found)/)?.length > 0
        if (isEventError) {
            const proposal = get(registeredProposalsForSelectedAccount)[eventId]
            if (proposal.status !== ProposalStatus.Ended) {
                addOrUpdateProposalToRegisteredProposals(
                    { ...proposal, isNodeOutdated: true },
                    get(selectedAccountIndex)
                )
            }
        }
        return undefined
    }
}
