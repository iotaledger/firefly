<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { Button, Text, FontWeight, TextType, TextInput, AssetAmountInput } from '@ui'
    import { handleError } from '@core/error/handlers'
    import {
        selectedWallet,
        visibleSelectedWalletAssets,
        getDefaultTransactionOptions,
        AddressConverter,
        hasWalletMainAccountNegativeBIC,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth, getNetworkHrp } from '@core/profile'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'
    import { onMount } from 'svelte'
    import { ManaBox } from '@components'
    import Big from 'big.js'
    import { validateBech32Address } from '@core/utils'
    import { AddressType } from '@iota/sdk/out/types'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let rawAmount: string = '0'
    export let accountAddress: string

    let isBusy = false
    let error: string
    let amount: string
    let assetAmountInput: AssetAmountInput

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    $: hasTransactionInProgress =
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress || $selectedWallet?.isTransferring
    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network?.id].mana
    $: validAmount = Big(rawAmount ?? 0)?.gt(0)
    $: accountAddress, validAmount, void preparedOutput()
    $: accountAddress, void validateAddress()

    $: sendAllowed =
        validAmount &&
        !!accountAddress &&
        !hasTransactionInProgress &&
        hasEnoughMana &&
        !error &&
        !hasMainAccountNegativeBIC &&
        transactionInfo.preparedTransaction &&
        !transactionInfo.preparedTransactionError

    $: displayManaBox = validAmount && !!accountAddress && !hasTransactionInProgress && !error

    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)

    async function onSend(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)
            if (!rawAmount || !accountAddress || !validAmount) return
            updatePopupProps({ rawAmount, accountAddress })
            await checkActiveProfileAuth(allotMana, { stronghold: true, ledger: false })
        } catch (err) {
            error = err.message
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function validateAddress(): void {
        try {
            if (!accountAddress) return
            validateBech32Address(getNetworkHrp(), accountAddress, AddressType.Account)
            error = undefined
        } catch (err) {
            error = err.message
        }
    }

    async function preparedOutput() {
        if (!accountAddress || !rawAmount || !validAmount) {
            transactionInfo.preparedTransaction = undefined
            transactionInfo.preparedTransactionError = undefined
            return
        }
        try {
            const accountId = AddressConverter.parseBech32Address(accountAddress)
            const prepareOutput = await $selectedWallet.prepareOutput(
                {
                    recipientAddress: $selectedWallet.depositAddress,
                    amount: '0',
                },
                getDefaultTransactionOptions()
            )
            transactionInfo.preparedTransaction = await $selectedWallet.prepareSendOutputs([prepareOutput], {
                ...getDefaultTransactionOptions(),
                manaAllotments: { [accountId]: Number(rawAmount) },
            })
        } catch (err) {
            error = err
            transactionInfo.preparedTransactionError = err
        }
    }

    async function allotMana(): Promise<void> {
        try {
            const accountId = AddressConverter.parseBech32Address(accountAddress)
            // Send 0 amount transaction to accountAddress with amount in the allotMana
            const prepareOutput = await $selectedWallet.prepareOutput(
                { recipientAddress: accountAddress, amount: '0' },
                getDefaultTransactionOptions()
            )
            await $selectedWallet.sendOutputs([prepareOutput], {
                ...getDefaultTransactionOptions(),
                manaAllotments: { [accountId]: Number(rawAmount) }, // if manaAllotments amount passed as bigint it is transformed to string in the sdk
            })
            closePopup()
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
            await preparedOutput()
        } catch (err) {
            error = err.message
            handleError(err.error)
        }
    })
</script>

<allot-mana-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.allotMana.title')}
    </Text>
    <div class="w-full flex-col space-y-4">
        <form id="allot-mana" on:submit|preventDefault={onSend} class="flex flex-col space-y-5">
            <div class="space-y-4">
                <AssetAmountInput
                    bind:this={assetAmountInput}
                    bind:rawAmount
                    bind:amount
                    bind:asset
                    containsSlider
                    disableAssetSelection
                    disabled={hasTransactionInProgress}
                />
                <TextInput
                    bind:value={accountAddress}
                    placeholder={localize('general.accountAddress')}
                    label={localize('popups.allotMana.body')}
                    submitHandler={onSend}
                    disabled={isBusy}
                />
                {#if error}
                    <Text error>{error}</Text>
                {/if}
                {#if displayManaBox}
                    <ManaBox {transactionInfo} bind:hasEnoughMana />
                {/if}
            </div>
            <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
                <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}
                    >{localize('actions.cancel')}</Button
                >
                <Button classes="w-full" onClick={onSend} disabled={!sendAllowed} {isBusy}>
                    {localize('actions.send')}
                </Button>
            </popup-buttons>
        </form>
    </div>
</allot-mana-popup>
