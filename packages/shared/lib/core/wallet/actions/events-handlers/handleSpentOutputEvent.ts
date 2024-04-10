import { activeWallets, updateActiveWallet } from '@core/profile'
import {
    WalletApiEventHandler,
    generateAndStoreActivitiesForWallet,
    isDelegationOutput,
    syncBalance,
    validateWalletApiEvent,
} from '@core/wallet'
import { SpentOutputWalletEvent, WalletEvent, WalletEventType } from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { closePopup } from 'shared/lib/auxiliary/popup'

export function handleSpentOutputEvent(walletId: string): WalletApiEventHandler {
    return async (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.SpentOutput)
        if (rawEvent.type === WalletEventType.SpentOutput) {
            await handleSpentOutputEventInternal(walletId, rawEvent as SpentOutputWalletEvent)
        }
    }
}

export async function handleSpentOutputEventInternal(walletId: string, payload: SpentOutputWalletEvent): Promise<void> {
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const output = payload.output
    const _isDelegationOutput = isDelegationOutput(output)

    await syncBalance(walletId, true)
    if (wallet) {
        const walletOutputs = await wallet.outputs()
        const accountOutputs = await wallet.accounts()
        const walletUnspentOutputs = await wallet.unspentOutputs()
        const implicitAccountOutputs = await wallet.implicitAccounts()
        updateActiveWallet(walletId, { walletOutputs, accountOutputs, implicitAccountOutputs, walletUnspentOutputs })

        await generateAndStoreActivitiesForWallet(wallet)
    }

    if (_isDelegationOutput && wallet?.hasDelegationRewardClaimTransactionInProgress) {
        updateActiveWallet(walletId, {
            hasDelegationRewardClaimTransactionInProgress: false,
            isTransferring: false,
        })
        closePopup() // close claimDelegationRewardsPopup when the account output is burned
    }
}
