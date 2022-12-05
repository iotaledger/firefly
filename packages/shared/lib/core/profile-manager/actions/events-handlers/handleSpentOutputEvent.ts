import { syncBalance } from '@core/account/actions/syncBalance'
import { getNftByIdFromAllAccountNfts, updateNftInAllAccountNfts } from '@core/nfts'
import { activeAccounts } from '@core/profile/stores'
import { ActivityAsyncStatus, ActivityType } from '@core/wallet'
import { allAccountActivities, updateAsyncDataByTransactionId } from '@core/wallet/stores/all-account-activities.store'
import { get } from 'svelte/store'
import { WalletApiEvent } from '../../enums'
import { ISpentOutputEventPayload } from '../../interfaces'
import { validateWalletApiEvent } from '../../utils'

export async function handleSpentOutputEvent(error: Error, rawEvent: string): Promise<void> {
    const { accountIndex, payload } = validateWalletApiEvent(error, rawEvent, WalletApiEvent.SpentOutput)
    /* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
    await handleSpentOutputEventInternal(accountIndex, payload as ISpentOutputEventPayload)
}

export async function handleSpentOutputEventInternal(
    accountIndex: number,
    payload: ISpentOutputEventPayload
): Promise<void> {
    const account = get(activeAccounts)?.find((account) => account.index === accountIndex)
    const output = payload?.output
    await syncBalance(accountIndex)
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
