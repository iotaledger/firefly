import { Event, SpentOutputWalletEvent } from '@iota/wallet'
import { WalletEventType } from '@iota/wallet/out/types'

import { syncBalance } from '@core/account/actions/syncBalance'
import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNfts } from '@core/nfts'
import { activeAccounts, updateActiveAccount } from '@core/profile/stores'
import { ActivityAsyncStatus, ActivityType } from '@core/wallet'
import { allAccountActivities, updateAsyncDataByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { validateWalletApiEvent } from '../../utils'
import { getAddressesWithOutputs } from '@core/account'

export async function handleSpentOutputEvent(error: Error, rawEvent: Event): Promise<void> {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletEventType.SpentOutput)
    const type = payload.type
    if (type === WalletEventType.SpentOutput) {
        await handleSpentOutputEventInternal(accountIndex, payload as SpentOutputWalletEvent)
    }
}

export async function handleSpentOutputEventInternal(
    accountIndex: number,
    payload: SpentOutputWalletEvent
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = payload.output
    await syncBalance(accountIndex)
    if (account) {
        const addressesWithOutputs = await getAddressesWithOutputs(account)
        updateActiveAccount(account.index, { addressesWithOutputs })
    }
    const outputId = output?.outputId
    const activity = get(allAccountActivities)?.[accountIndex]?.find((_activity) => _activity.outputId === outputId)

    if (activity && activity.asyncData?.asyncStatus === ActivityAsyncStatus.Unclaimed) {
        const transactionId = output?.metadata?.transactionId
        updateAsyncDataByTransactionId(accountIndex, transactionId, {
            asyncStatus: ActivityAsyncStatus.Claimed,
        })
    }

    if (activity?.type === ActivityType.Nft) {
        const previousOutputId = getNftByIdFromAllAccountNfts(accountIndex, activity.nftId)?.latestOutputId
        const previousOutput = await account.getOutput(previousOutputId)
        if (output.metadata.milestoneTimestampBooked > previousOutput.metadata.milestoneTimestampBooked) {
            updateNftInAllAccountNfts(accountIndex, activity.nftId, { isSpendable: false })
        }
    }
}
