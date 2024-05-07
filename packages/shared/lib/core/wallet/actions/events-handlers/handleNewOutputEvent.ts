import { addNftsToDownloadQueue, addOrUpdateNftInAllWalletNfts, buildNftFromNftOutput } from '@core/nfts'
import { activeWallets, updateActiveWallet } from '@core/profile'
import { checkAndRemoveProfilePicture, updateActiveWalletPersistedData } from '@core/profile/actions'
import {
    IWrappedOutput,
    WalletApiEventHandler,
    AddressConverter,
    hasBlockIssuerFeature,
    isAccountOutput,
    isDelegationOutput,
    isImplicitAccountOutput,
    syncBalance,
    validateWalletApiEvent,
    generateAndStoreActivitiesForWallet,
} from '@core/wallet'
import {
    AccountAddress,
    AccountOutput,
    NewOutputWalletEvent,
    OutputType,
    WalletEvent,
    WalletEventType,
} from '@iota/sdk/out/types'
import { closePopup } from 'shared/lib/auxiliary/popup'
import { get } from 'svelte/store'

export function handleNewOutputEvent(walletId: string): WalletApiEventHandler {
    return (error: Error, rawEvent: WalletEvent) => {
        validateWalletApiEvent(error, rawEvent, WalletEventType.NewOutput)
        if (rawEvent.type === WalletEventType.NewOutput) {
            void handleNewOutputEventInternal(walletId, rawEvent as NewOutputWalletEvent)
        }
    }
}

export async function handleNewOutputEventInternal(walletId: string, payload: NewOutputWalletEvent): Promise<void> {
    const wallet = get(activeWallets)?.find((wallet) => wallet.id === walletId)
    const outputData = payload.output

    if (!wallet || !outputData) return

    const output = outputData.output
    const isNftOutput = output.type === OutputType.Nft
    const _isDelegationOutput = isDelegationOutput(outputData)

    // The basic outputs of the faucet dont have an address
    const isBasicOutput = output.type === OutputType.Basic
    if (!outputData?.remainder || isAccountOutput(outputData) || isDelegationOutput(outputData) || isBasicOutput) {
        await syncBalance(wallet.id, true)
        const walletOutputs = await wallet.outputs()
        const walletUnspentOutputs = await wallet.unspentOutputs()
        const accountOutputs = await wallet.accounts()
        updateActiveWallet(wallet.id, { walletOutputs, accountOutputs, walletUnspentOutputs })

        await generateAndStoreActivitiesForWallet(wallet)
    }
    if (isImplicitAccountOutput(outputData.output)) {
        await syncBalance(wallet.id, true)
        const implicitAccountOutputs = await wallet.implicitAccounts()
        updateActiveWallet(wallet.id, { implicitAccountOutputs })
    }
    if (isAccountOutput(outputData)) {
        const accountOutput = output as AccountOutput

        // if we receive the first account output, we set it as the mainAccountId of the wallet
        if (wallet?.hasImplicitAccountCreationTransactionInProgress && hasBlockIssuerFeature(accountOutput)) {
            if (!wallet.mainAccountId) {
                const mainAccountId = accountOutput.accountId
                updateActiveWalletPersistedData(walletId, {
                    mainAccountId,
                })
                updateActiveWallet(walletId, {
                    hasImplicitAccountCreationTransactionInProgress: false,
                    isTransferring: false,
                    depositAddress: AddressConverter.addressToBech32(new AccountAddress(mainAccountId)),
                })
            } else {
                updateActiveWallet(walletId, {
                    hasImplicitAccountCreationTransactionInProgress: false,
                    isImplicitAccountCreationStarted: false,
                    isTransferring: false,
                })
            }
            closePopup() // Close ActivateAccountPopup when account is activated
        }
    }

    if (_isDelegationOutput) {
        if (wallet?.hasDelegationTransactionInProgress) {
            updateActiveWallet(walletId, {
                hasDelegationTransactionInProgress: false,
                isTransferring: false,
            })
            closePopup() // close CreateDelegationPopup when the account output is created
        }
    }
    if (isNftOutput) {
        const wrappedOutput = outputData as unknown as IWrappedOutput
        const nft = buildNftFromNftOutput(wrappedOutput, wallet.depositAddress)
        addOrUpdateNftInAllWalletNfts(wallet.id, nft)
        void addNftsToDownloadQueue(walletId, [nft])

        checkAndRemoveProfilePicture()
    }
}
