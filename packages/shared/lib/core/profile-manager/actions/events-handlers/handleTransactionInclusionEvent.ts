import { get } from 'svelte/store'
import { updateParticipationOverview } from '@contexts/governance/stores'
import { syncVotingPower } from '@core/account'
import { updateNftInAllAccountNfts } from '@core/nfts'
import { ActivityAction, ActivityDirection, ActivityType, GovernanceActivity, InclusionState } from '@core/wallet'
import { updateClaimingTransactionInclusion } from '@core/wallet/actions/activities/updateClaimingTransactionInclusion'
import {
    getActivityByTransactionId,
    updateActivityByTransactionId,
} from '@core/wallet/stores/all-account-activities.store'
import { WalletApiEvent } from '../../enums'
import { ITransactionInclusionEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'
import { closePopup, openPopup } from '@auxiliary/popup/actions'
import { PopupId } from '@auxiliary/popup'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'
import { updateActiveAccountMetadata } from '@core/profile/actions'
import { isAccountVoting } from '@contexts/governance/utils/isAccountVoting'
import { GovernanceTransactionType } from '@contexts/governance/enums'

export function handleTransactionInclusionEvent(error: Error, rawEvent: string): void {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.TransactionInclusion)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    handleTransactionInclusionEventInternal(accountIndex, payload as ITransactionInclusionEventPayload)
}

export function handleTransactionInclusionEventInternal(
    accountIndex: number,
    payload: ITransactionInclusionEventPayload
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

    updateClaimingTransactionInclusion(transactionId, inclusionState, accountIndex)
}

function handleGovernanceTransactionInclusionEvent(
    accountIndex: number,
    inclusionState: InclusionState,
    activity: GovernanceActivity
): void {
    if (inclusionState === InclusionState.Confirmed) {
        // This is usually done after a transaction is returned from wallet.rs
        // in the case of governance we want to wait for the transaction to be confirmed
        // we should think about making this consistent in the future
        updateActiveAccount(accountIndex, { isTransferring: false })
        // need to move this
        closePopup(true)

        const account = get(activeAccounts)?.find((_account) => _account.index === accountIndex)
        if (account.processingGovernanceTransactionType === GovernanceTransactionType.VotingPower) {
            if (isAccountVoting(accountIndex) && activity.votingPower !== 0) {
                updateActiveAccountMetadata(accountIndex, { shouldRevote: true })
                openPopup({ id: PopupId.Revote })
            }
        } else {
            updateActiveAccountMetadata(accountIndex, { shouldRevote: false })
        }

        updateActiveAccount(accountIndex, { processingGovernanceTransactionType: null, isTransferring: false })
        void updateParticipationOverview(accountIndex)
    }
    syncVotingPower(accountIndex)
}
