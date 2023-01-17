import { get } from 'svelte/store'
import { votingPowerTransactionState } from '@contexts/governance/stores'
import { syncVotingPower } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts'

import { ActivityAction, ActivityDirection, ActivityType } from '@core/wallet'
import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import {
    updateActivityByTransactionId,
    getActivityByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'

import { WalletApiEvent } from '../../enums'
import { ITransactionInclusionEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionInclusion)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEventPayload)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
): void {
    const { inclusionState } = payload
    updateActivityByTransactionId(accountIndex, payload.transactionId, { inclusionState })

    const activity = getActivityByTransactionId(accountIndex, payload.transactionId)

    if (activity?.type === ActivityType.Nft) {
        const isSpendable =
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.action !== ActivityAction.Burn
        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable })
    }

    if (activity?.tag === 'PARTICIPATE') {
        if (get(votingPowerTransactionState)) {
            votingPowerTransactionState.set(inclusionState)
        }
        syncVotingPower(accountIndex)
    }

    updateClaimingTransactionInclusion(payload.transactionId, inclusionState, accountIndex)
}
