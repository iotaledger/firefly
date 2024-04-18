<script lang="ts">
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import { getSelectedWallet } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { getArchivedBaseTokens } from '@core/layer-2/helpers/getArchivedBaseTokens'
    import { getBaseToken, getCoinType, activeProfile, isActiveLedgerProfile, isSoftwareProfile } from '@core/profile'
    import { truncateString } from '@core/utils'
    import { formatTokenAmountPrecise, getRequiredStorageDepositForMinimalBasicOutput } from '@core/wallet'
    import { Button, FontWeight, KeyValueBox, Spinner, Text, TextType } from '@ui'
    import { onMount } from 'svelte'
    import { WithdrawRequest, getLayer2WithdrawRequest } from '@core/layer-2/utils'
    import { withdrawL2Funds } from '@core/layer-2/helpers/widthdrawL2Funds'
    import { getL2ReceiptByRequestId } from '@core/layer-2/helpers/getL2ReceiptByRequestId'
    import { showAppNotification } from '@auxiliary/notification'
    import { Bip44 } from '@iota/sdk/out/types'
    import { displayNotificationForLedgerProfile, ledgerNanoStatus } from '@core/ledger'
    import { getEstimatedGasForOffLedgerRequest, getNonceForWithdrawRequest } from '@core/layer-2/helpers'

    export let withdrawOnLoad = false
    export let withdrawableAmount: number
    const WASP_ISC_OPTIMIZATION_AMOUNT = 1
    const WASP_ISC_MOCK_GAS_AMOUNT = 1000

    const bip44Chain: Bip44 = {
        coinType: Number(getCoinType()),
        account: 0,
        change: 0,
        addressIndex: 0,
    }

    let error = ''
    let address: string | undefined = undefined
    let isWithdrawing = false
    const { isStrongholdLocked } = $activeProfile

    $: withdrawOnLoad && address && !$isStrongholdLocked && withdrawFromL2()

    function onCancelClick(): void {
        closePopup()
    }

    async function onWithdrawFromL2Click(): Promise<void> {
        if ($isSoftwareProfile && $isStrongholdLocked) {
            openUnlockStrongholdPopup()
        } else {
            await handleAction(withdrawFromL2)
        }
    }

    async function handleAction(callback: () => Promise<void>): Promise<void> {
        try {
            error = ''

            if ($isActiveLedgerProfile && !$ledgerNanoStatus.connected) {
                displayNotificationForLedgerProfile('warning')
                return
            }

            await callback()
        } catch (err) {
            error = localize(err.error)

            if ($isActiveLedgerProfile) {
                displayNotificationForLedgerProfile('error', true, true, err)
            } else {
                showAppNotification({
                    type: 'error',
                    message: localize(err.error),
                })
            }
        }
    }

    async function withdrawFromL2(): Promise<void> {
        isWithdrawing = true
        if ($isActiveLedgerProfile && !$ledgerNanoStatus.connected) {
            isWithdrawing = false
            displayNotificationForLedgerProfile('warning')
            return
        }
        try {
            const nonce = await getNonceForWithdrawRequest(address)
            if (!nonce) {
                isWithdrawing = false
                displayNotificationForLedgerProfile('warning')
                return
            }

            const minRequiredStorageDeposit: number = Number(await getRequiredStorageDepositForMinimalBasicOutput())
            let withdrawAmount =
                withdrawableAmount < minRequiredStorageDeposit + WASP_ISC_MOCK_GAS_AMOUNT
                    ? withdrawableAmount
                    : withdrawableAmount - WASP_ISC_MOCK_GAS_AMOUNT

            // create withdraw request for gas estimations with hardcoded gasBudget
            let withdrawRequest: WithdrawRequest | undefined
            withdrawRequest = await getLayer2WithdrawRequest(withdrawAmount, nonce, bip44Chain)
            const gasEstimatePayload = await getEstimatedGasForOffLedgerRequest(withdrawRequest.request)

            // adjust withdrawAmount to use estimated gas fee charged
            withdrawAmount = withdrawableAmount - gasEstimatePayload.gasFeeCharged
            // calculate gas
            const gasBudget = gasEstimatePayload.gasBurned + WASP_ISC_OPTIMIZATION_AMOUNT

            if (withdrawableAmount > Number(minRequiredStorageDeposit) + Number(gasBudget)) {
                // Create new withdraw request with correct gas budget and withdraw amount
                withdrawRequest = await getLayer2WithdrawRequest(withdrawAmount, nonce, bip44Chain, gasBudget)
            } else {
                isWithdrawing = false
                showErrorNotification(localize('error.send.notEnoughBalance'))
                return
            }

            await withdrawL2Funds(withdrawRequest.request)
            const receipt = await getL2ReceiptByRequestId(withdrawRequest.requestId)

            isWithdrawing = false
            if (receipt?.errorMessage) {
                // if withdawing fails refresh the withdrawable amount because gas was used for the withdraw attempt
                withdrawableAmount = await getArchivedBaseTokens(address)
                showErrorNotification(receipt?.errorMessage)
            } else {
                closePopup()
            }
        } catch (err) {
            // if withdawing fails refresh the withdrawable amount because gas was used for the withdraw attempt (withdrawL2Funds())
            withdrawableAmount = await getArchivedBaseTokens(address)
            let error = err
            // TODO: check error object in real ledger device when user cancels transaction. (In simulator the returned object is a string)
            // parse the error because ledger simulator returns error as a string.
            if (typeof err === 'string') {
                try {
                    const parsedError = JSON.parse(err)
                    error = parsedError?.payload ? parsedError.payload : parsedError
                } catch (e) {
                    console.error(e)
                }
            }
            isWithdrawing = false
            showErrorNotification(error)
        }
    }

    function openUnlockStrongholdPopup(): void {
        openPopup({
            id: PopupId.UnlockStronghold,
            props: {
                onSuccess: () => {
                    openPopup({
                        id: PopupId.WithdrawFromL2,
                        props: {
                            withdrawOnLoad: true,
                            withdrawableAmount,
                        },
                    })
                },
                onCancelled: () => {
                    openPopup({
                        id: PopupId.WithdrawFromL2,
                        props: {
                            withdrawableAmount,
                        },
                    })
                },
                subtitle: localize('popups.password.backup'),
            },
        })
    }
    function showErrorNotification(error): void {
        if ($isActiveLedgerProfile) {
            displayNotificationForLedgerProfile('error', true, false, error)
        } else {
            showAppNotification({
                type: 'error',
                message: error,
                alert: true,
            })
        }
    }

    onMount(async () => {
        address = getSelectedWallet().depositAddress
        if (!withdrawableAmount) {
            withdrawableAmount = await getArchivedBaseTokens(address)
        }
    })
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.withdrawFromL2.title')}
    </Text>
    <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.withdrawFromL2.body')}</Text>
    {#if address}
        <KeyValueBox
            classes="flex items-center w-full py-4"
            keyText={truncateString(address, 15, 15)}
            valueText={formatTokenAmountPrecise(withdrawableAmount, getBaseToken())}
        />
    {:else}
        <div class="flex items-center justify-center">
            <Spinner />
        </div>
    {/if}
    <div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
        <Button classes="w-full" outline onClick={onCancelClick} disabled={isWithdrawing}>
            {localize('actions.cancel')}
        </Button>
        <Button
            classes="w-full"
            onClick={onWithdrawFromL2Click}
            disabled={!withdrawableAmount || Number(withdrawableAmount) === 0 || isWithdrawing}
            isBusy={isWithdrawing}
            busyMessage={localize('popups.withdrawFromL2.withdrawing')}
        >
            {localize('popups.withdrawFromL2.withdraw')}
        </Button>
    </div>
</div>
