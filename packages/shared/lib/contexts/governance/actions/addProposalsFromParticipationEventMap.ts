import { ParticipationEventMap, ParticipationEventWithNodes } from '@iota/sdk/out/types'

import { addOrUpdateProposalToRegisteredProposals } from '../stores'
import { createProposalFromEvent } from '../utils'
import { IWalletState } from 'shared/lib/core/wallet'

export function addProposalsFromParticipationEventMap(eventMap: ParticipationEventMap, wallet: IWalletState): void {
    Object.values(eventMap).forEach((event: ParticipationEventWithNodes) => {
        const proposal = createProposalFromEvent(event)
        addOrUpdateProposalToRegisteredProposals(proposal, wallet.id)
    })
}
