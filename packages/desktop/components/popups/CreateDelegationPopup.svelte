<script lang="ts">
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { ManaBox } from '@components'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'
    import { activeProfile, checkActiveProfileAuth, updateActiveWallet } from '@core/profile'
    import { getNetworkHrp } from '@core/profile/actions'
    import { validateBech32Address } from '@core/utils/crypto'
    import {
        AddressConverter,
        getDefaultTransactionOptions,
        hasWalletMainAccountNegativeBIC,
        selectedWallet,
        selectedWalletId,
        visibleSelectedWalletAssets,
    } from '@core/wallet'
    import { AccountAddress, AddressType, CreateDelegationParams } from '@iota/sdk/out/types'
    import { AssetAmountInput, Button, HTMLButtonType, Text, TextHint, TextHintVariant, TextInput, TextType } from '@ui'
    import Big from 'big.js'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let rawAmount: string = '0'
    export let accountAddress: string

    let assetAmountInput: AssetAmountInput
    let confirmAllowed = false
    let addressError: string

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network?.id].baseCoin
    $: hasTransactionInProgress =
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress ||
        $selectedWallet?.hasDelegationTransactionInProgress ||
        $selectedWallet?.isTransferring
    $: validAmount = Big(rawAmount ?? 0)?.gt(0)

    $: accountAddress, validAmount, rawAmount, void prepareDelegationOutput()

    $: confirmAllowed =
        validAmount &&
        !!accountAddress &&
        !hasTransactionInProgress &&
        hasEnoughMana &&
        !addressError &&
        !hasMainAccountNegativeBIC &&
        transactionInfo.preparedTransaction &&
        !transactionInfo.preparedTransactionError
    $: displayManaBox = !!accountAddress && !addressError && validAmount && !hasTransactionInProgress
    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)
            if (!rawAmount || !accountAddress || !validAmount) return
            updatePopupProps({ rawAmount, accountAddress })
            await checkActiveProfileAuth(delegate, { stronghold: true, ledger: false })
        } catch (err) {
            handleError(err)
        }
    }

    async function delegate(): Promise<void> {
        try {
            const params: CreateDelegationParams = {
                address: AddressConverter.addressToBech32(new AccountAddress($selectedWallet.mainAccountId)),
                delegatedAmount: rawAmount,
                validatorAddress: new AccountAddress(AddressConverter.parseBech32Address(accountAddress)),
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

    async function prepareDelegationOutput(): Promise<void> {
        try {
            if (!accountAddress || !rawAmount || !validAmount) {
                transactionInfo.preparedTransaction = undefined
                transactionInfo.preparedTransactionError = undefined
                return
            }
            validateBech32Address(getNetworkHrp(), accountAddress, AddressType.Account)
            addressError = undefined
            const params: CreateDelegationParams = {
                address: AddressConverter.addressToBech32(new AccountAddress($selectedWallet?.mainAccountId)),
                delegatedAmount: rawAmount,
                validatorAddress: new AccountAddress(AddressConverter.parseBech32Address(accountAddress)),
            }
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareCreateDelegation(
                params,
                getDefaultTransactionOptions()
            )
            transactionInfo.preparedTransactionError = undefined
        } catch (error) {
            if (error.message?.includes('slots remaining until enough mana')) {
                transactionInfo.preparedTransaction = undefined
                transactionInfo.preparedTransactionError = error
            } else {
                addressError = error.message
            }
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
            {#if addressError}
                <Text error>{addressError}</Text>
            {/if}
            {#if displayManaBox}
                <ManaBox {transactionInfo} bind:hasEnoughMana />
            {/if}
            {#if hasMainAccountNegativeBIC}
                <TextHint variant={TextHintVariant.Danger} text={localize('popups.transaction.negativeBIC')} />
            {/if}
        </div>
        <div class="flex flex-row flex-nowrap w-full space-x-4">
            <Button outline disabled={hasTransactionInProgress} classes="w-full" onClick={onCancelClick}>
                {localize('actions.cancel')}
            </Button>
            <Button
                type={HTMLButtonType.Submit}
                disabled={!confirmAllowed}
                isBusy={hasTransactionInProgress}
                classes="w-full"
            >
                {localize('actions.confirm')}
            </Button>
        </div>
    </form>
</create-delegation-popup>
