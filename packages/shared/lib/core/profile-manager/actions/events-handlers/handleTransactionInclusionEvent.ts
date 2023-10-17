import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { Event, TransactionInclusionWalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { updateParticipationOverview } from '@contexts/governance/stores'
import { isAccountVoting } from '@contexts/governance/utils/isAccountVoting'
import { syncVotingPower } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { updateActiveAccountPersistedData } from '@core/profile/actions'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'
import { ActivityAction, ActivityDirection, ActivityType, GovernanceActivity, InclusionState } from '@core/wallet'
import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import {
    getActivityByTransactionId,
    updateActivityByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'

export function handleTransactionInclusionEvent(error: Error, rawEvent: Event): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionInclusion)
    const type = payload?.type
    if (type === WalletEventType.TransactionInclusion) {
        handleTransactionInclusionEventInternal(accountIndex, payload as TransactionInclusionWalletEvent)
    }
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: TransactionInclusionWalletEvent
): void {
    const { inclusionState, transactionId } = payload
    updateActivityByTransactionId(accountIndex, transactionId, { inclusionState })

    const activity = getActivityByTransactionId(accountIndex, transactionId)

    if (activity?.type === ActivityType.Nft) {
        const isSpendable =
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.action !== ActivityAction.Burn
        updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable })
    }

    if (activity?.type === ActivityType.Governance) {
        handleGovernanceTransactionInclusionEvent(accountIndex, inclusionState, activity)
    }

    if (activity?.type === ActivityType.Consolidation) {
        handleConsolidationTransactionInclusionEvent(accountIndex, inclusionState)
    }

    updateClaimingTransactionInclusion(transactionId, inclusionState, accountIndex)
}

function handleGovernanceTransactionInclusionEvent(
    accountIndex: number,
    inclusionState: InclusionState,
    activity: GovernanceActivity
): void {
    if (inclusionState === InclusionState.Confirmed) {
        // TODO: Normally we update active account after a wallet.rs returns a transaction
        // With governance we wait for the transaction confirmation
        // we should think about making this consistent in the future
        updateActiveAccount(accountIndex, { isTransferring: false })
        // TODO: move this
        closePopup(true)

        const account = get(activeAccounts)?.find((_account) => _account.index === accountIndex)
        if (!account) {
            return
        }
        if (account.hasVotingPowerTransactionInProgress) {
            updateActiveAccount(accountIndex, { hasVotingPowerTransactionInProgress: false })
            if (isAccountVoting(accountIndex) && activity.votingPower !== 0) {
                updateActiveAccountPersistedData(accountIndex, { shouldRevote: true })
                openPopup({ id: PopupId.Revote })
            }
        } else {
            updateActiveAccount(accountIndex, { hasVotingTransactionInProgress: false })
            updateActiveAccountPersistedData(accountIndex, { shouldRevote: false })
        }
        void updateParticipationOverview(accountIndex)
    }
    syncVotingPower(accountIndex)
}

function handleConsolidationTransactionInclusionEvent(accountIndex: number, inclusionState: InclusionState): void {
    if (inclusionState === InclusionState.Confirmed) {
        // TODO: Normally we update active account after a the sdk returns a transaction
        // With output consolidation we wait for the transaction confirmation to improve the UX of the vesting tab
        // we should think about making this consistent in the future
        updateActiveAccount(accountIndex, { isTransferring: false })
        const account = get(activeAccounts)?.find((_account) => _account.index === accountIndex)
        if (!account) {
            return
        }
        if (account?.hasConsolidatingOutputsTransactionInProgress) {
            updateActiveAccount(accountIndex, { hasConsolidatingOutputsTransactionInProgress: false })
        }
    }
}
