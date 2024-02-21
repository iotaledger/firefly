<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { api } from '@core/api'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import {
        convertToRawAmount,
        getDefaultTransactionOptions,
        selectedWallet,
        visibleSelectedWalletAssets,
    } from '@core/wallet'
    import { AccountAddress, CreateDelegationParams } from '@iota/sdk/out/types'
    import { Text, TextType, AssetAmountInput, TextInput, Button, HTMLButtonType } from '@ui'

    let assetAmountInput: AssetAmountInput
    let amount: string
    let accountId: string
    let rawAmount = $selectedWallet.balances.baseCoin.available.toString()
    let confirmDisabled = false

    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network.id].baseCoin
    $: hasTransactionInProgress =
        // $selectedWallet?.hasVotingPowerTransactionInProgress ||
        // $selectedWallet?.hasVotingTransactionInProgress ||
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress || $selectedWallet?.isTransferring
    $: amount, hasTransactionInProgress, setConfirmDisabled()

    function setConfirmDisabled(): void {
        if (!amount) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount, asset?.metadata)?.toString()
        confirmDisabled =
            convertedSliderAmount === $selectedWallet.balances.baseCoin.available.toString() || hasTransactionInProgress
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)
            if (!rawAmount || !accountId) return
            const params: CreateDelegationParams = {
                address: api.accountIdToBech32($selectedWallet.mainAccountId, 'rms'),
                delegatedAmount: Number(rawAmount), // The interface delegatedAmount is a string but the sdk returns an error if it is not a number
                // rms1pqrh7456g0xtujtk2crfdvmsrqhr7595enynefpnhl3wurmr0ypnztgqay2 -> account address with staking feature converted to accountId to try it
                validatorAddress: new AccountAddress(
                    '0x077f569a43ccbe4976560696b370182e3f50b4ccc93ca433bfe2ee0f63790331'
                ),
            }

            await $selectedWallet.createDelegation(params, getDefaultTransactionOptions())
        } catch (err) {
            handleError(err)
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<create-delegation-popup class="flex flex-col space-y-6">
    <form id="create-delegation" on:submit|preventDefault={onSubmit}>
        <Text type={TextType.h4} classes="mb-3">{localize('popups.createDelegation.title')}</Text>
        <Text type={TextType.p} classes="mb-5">{localize('popups.createDelegation.body')}</Text>
        <div class="space-y-4 mb-6">
            <AssetAmountInput
                bind:this={assetAmountInput}
                bind:rawAmount
                bind:amount
                {asset}
                containsSlider
                disableAssetSelection
                disabled={hasTransactionInProgress}
            />
            <TextInput
                bind:value={accountId}
                placeholder={localize('popups.createDelegation.account.title')}
                label={localize('popups.createDelegation.account.description')}
            />
        </div>
        <div class="flex flex-row flex-nowrap w-full space-x-4">
            <Button outline disabled={hasTransactionInProgress} classes="w-full" onClick={onCancelClick}>
                {localize('actions.cancel')}
            </Button>
            <Button
                type={HTMLButtonType.Submit}
                disabled={confirmDisabled}
                isBusy={hasTransactionInProgress}
                classes="w-full"
            >
                {localize('actions.confirm')}
            </Button>
        </div>
    </form>
</create-delegation-popup>
