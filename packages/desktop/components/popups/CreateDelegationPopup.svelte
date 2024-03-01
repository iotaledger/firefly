<script lang="ts">
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { api } from '@core/api'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { activeProfile, checkActiveProfileAuth, getNetworkHrp, updateActiveWallet } from '@core/profile'
    import {
        convertToRawAmount,
        getDefaultTransactionOptions,
        selectedWallet,
        selectedWalletId,
        visibleSelectedWalletAssets,
    } from '@core/wallet'
    import { AccountAddress, CreateDelegationParams } from '@iota/sdk/out/types'
    import { Text, TextType, AssetAmountInput, TextInput, Button, HTMLButtonType } from '@ui'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let rawAmount: string = $selectedWallet?.balances?.baseCoin?.available?.toString()
    export let accountAddress: string

    let assetAmountInput: AssetAmountInput
    let amount: string
    let confirmDisabled = false

    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network?.id].baseCoin
    $: hasTransactionInProgress =
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress ||
        $selectedWallet?.hasDelegationTransactionInProgress ||
        $selectedWallet?.isTransferring
    $: amount, accountAddress, hasTransactionInProgress, setConfirmDisabled()

    function setConfirmDisabled(): void {
        if (!amount || !accountAddress) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount, asset?.metadata)?.toString()
        confirmDisabled = convertedSliderAmount === rawAmount || hasTransactionInProgress
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)
            if (!rawAmount || !accountAddress) return
            updatePopupProps({ rawAmount, accountAddress })
            await checkActiveProfileAuth(delegate, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    async function delegate(): Promise<void> {
        try {
            const params: CreateDelegationParams = {
                address: api.accountIdToBech32($selectedWallet.mainAccountId, getNetworkHrp()),
                delegatedAmount: rawAmount,
                validatorAddress: new AccountAddress(api.bech32ToHex(accountAddress)),
            }
            await $selectedWallet.createDelegation(params, getDefaultTransactionOptions())
            updateActiveWallet($selectedWalletId, {
                hasDelegationTransactionInProgress: true,
                isTransferring: true,
            })
        } catch (err) {
            handleError(err)
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<create-delegation-popup class="flex flex-col space-y-6">
    <Text type={TextType.h4}>{localize('popups.createDelegation.title')}</Text>
    <form id="create-delegation" on:submit|preventDefault={onSubmit} class="flex flex-col space-y-5">
        <Text type={TextType.p}>{localize('popups.createDelegation.body')}</Text>
        <div class="space-y-4">
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
                bind:value={accountAddress}
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
