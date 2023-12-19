import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
import { Event, TransactionInclusionWalletEvent, WalletEventType } from '@iota/sdk/out/types'

import { updateParticipationOverview } from '@contexts/governance/stores'
import { isWalletVoting } from 'shared/lib/contexts/governance/utils/isWalletVoting'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { updateActiveWalletPersistedData } from '@core/profile/actions'
import { syncVotingPower, getActivityByTransactionId,
    updateActivityByTransactionId, validateWalletApiEvent, updateClaimingTransactionInclusion,  ActivityAction, ActivityDirection, ActivityType, GovernanceActivity, InclusionState } from '@core/wallet'
import { get } from 'svelte/store'
import { activeWallets, updateActiveWallet } from 'shared/lib/core/profile'

export function handleTransactionInclusionEvent(error: Error, rawEvent: Event): void {
    const { walletId, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.TransactionInclusion)
    const type = payload?.type
    if (type === WalletEventType.TransactionInclusion) {
        handleTransactionInclusionEventInternal(walletId, payload as TransactionInclusionWalletEvent)
    }
}

export function handleTransactionInclusionEventInternal(
    walletId: string,
    payload: TransactionInclusionWalletEvent
): void {
    const { inclusionState, transactionId } = payload
    updateActivityByTransactionId(walletId, transactionId, { inclusionState })

    const activity = getActivityByTransactionId(walletId, transactionId)

    if (activity?.type === ActivityType.Nft) {
        const isSpendable =
            (activity.direction === ActivityDirection.Incoming ||
                activity.direction === ActivityDirection.SelfTransaction) &&
            activity.action !== ActivityAction.Burn
        updateNftInAllAccountNfts(walletId, activity.nftId, { isSpendable })
    }

    if (activity?.type === ActivityType.Governance) {
        handleGovernanceTransactionInclusionEvent(walletId, inclusionState, activity)
    }

    if (activity?.type === ActivityType.Consolidation) {
        handleConsolidationTransactionInclusionEvent(walletId, inclusionState)
    }

    updateClaimingTransactionInclusion(transactionId, inclusionState, walletId)
}

function handleGovernanceTransactionInclusionEvent(
    walletId: string,
    inclusionState: InclusionState,
    activity: GovernanceActivity
): void {
    if (inclusionState === InclusionState.Confirmed) {
        // TODO: Normally we update active account after a wallet.rs returns a transaction
        // With governance we wait for the transaction confirmation
        // we should think about making this consistent in the future
        updateActiveWallet(walletId, { isTransferring: false })
        // TODO: move this
        closePopup(true)

        const wallet = get(activeWallets)?.find((_wallet) => _wallet.id === walletId)
        if (!wallet) {
            return
        }
        if (wallet.hasVotingPowerTransactionInProgress) {
            updateActiveWallet(walletId, { hasVotingPowerTransactionInProgress: false })
            if (isWalletVoting(walletId) && activity.votingPower !== 0) {
                updateActiveWalletPersistedData(walletId, { shouldRevote: true })
                openPopup({ id: PopupId.Revote })
            }
        } else {
            updateActiveWallet(walletId, { hasVotingTransactionInProgress: false })
            updateActiveWalletPersistedData(walletId, { shouldRevote: false })
        }
        void updateParticipationOverview(walletId)
    }
    syncVotingPower(walletId)
}

function handleConsolidationTransactionInclusionEvent(walletId: string, inclusionState: InclusionState): void {
    if (inclusionState === InclusionState.Confirmed) {
        // TODO: Normally we update active account after a the sdk returns a transaction
        // With output consolidation we wait for the transaction confirmation to improve the UX of the vesting tab
        // we should think about making this consistent in the future
        updateActiveWallet(walletId, { isTransferring: false })
        const account = get(activeWallets)?.find((_wallet) => _wallet.id === walletId)
        if (!account) {
            return
        }
        if (account?.hasConsolidatingOutputsTransactionInProgress) {
            updateActiveWallet(walletId, { hasConsolidatingOutputsTransactionInProgress: false })
        }
    }
}
