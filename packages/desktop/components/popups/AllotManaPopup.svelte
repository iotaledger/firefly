<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { Button, Text, FontWeight, TextType, TextInput, AssetAmountInput } from '@ui'
    import { handleError } from '@core/error/handlers'
    import {
        selectedWallet,
        visibleSelectedWalletAssets,
        convertToRawAmount,
        getDefaultTransactionOptions,
        AddressConverter,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import { ITransactionInfoToCalculateManaCost, getManaBalance } from '@core/network'
    import { onMount } from 'svelte'
    import { ManaBox } from '@components'
    import Big from 'big.js'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let rawAmount: string = getManaBalance($selectedWallet?.balances?.mana?.available)?.toString()
    export let accountAddress: string

    let isBusy = false
    let error: string
    let amount: string
    let assetAmountInput: AssetAmountInput
    let confirmDisabled = false

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    $: hasTransactionInProgress =
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress || $selectedWallet?.isTransferring
    $: amount, accountAddress, hasTransactionInProgress, setConfirmDisabled()
    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network?.id].mana
    $: validAmount = Big(rawAmount ?? 0)?.gt(0)
    $: accountAddress, validAmount, preparedOutput()

    $: displayManaBox =
        !!accountAddress &&
        !error &&
        validAmount &&
        transactionInfo.preparedTransaction &&
        !transactionInfo.preparedTransactionError

    function setConfirmDisabled(): void {
        if (!amount || !accountAddress) {
            confirmDisabled = true
            return
        }
        const convertedSliderAmount = convertToRawAmount(amount, asset?.metadata)?.toString()
        confirmDisabled = convertedSliderAmount === rawAmount || hasTransactionInProgress || !hasEnoughMana
    }

    async function onSubmit(): Promise<void> {
        try {
            await assetAmountInput?.validate(true)
            if (!rawAmount || !accountAddress || !validAmount) return
            updatePopupProps({ rawAmount, accountAddress })
            await checkActiveProfileAuth(allotMana, { stronghold: true, ledger: false })
        } catch (err) {
            error = err.error
            handleError(err)
        } finally {
            isBusy = false
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
                ...getDefaultTransactionOptions(accountId),
                manaAllotments: { [accountId]: Number(rawAmount) },
            })
        } catch (error) {
            transactionInfo.preparedTransactionError = error
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
                ...getDefaultTransactionOptions(accountId),
                manaAllotments: { [accountId]: Number(rawAmount) }, // if manaAllotments amount passed as bigint it is transformed to string in the sdk
            })
            closePopup()
        } catch (err) {
            handleError(err)
        }
    }

    function onBackClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
            await preparedOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<allot-mana-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.allotMana.title')}
    </Text>
    <div class="w-full flex-col space-y-4">
        <form id="allot-mana" on:submit|preventDefault={onSubmit} class="flex flex-col space-y-5">
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
                    {error}
                    bind:value={accountAddress}
                    placeholder={localize('general.accountAddress')}
                    label={localize('popups.allotMana.body')}
                    submitHandler={onSubmit}
                    disabled={isBusy}
                />
                {#if displayManaBox}
                    <ManaBox {transactionInfo} bind:hasEnoughMana />
                {/if}
            </div>
            <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
                <Button classes="w-full" outline onClick={onBackClick} disabled={isBusy}
                    >{localize('actions.back')}</Button
                >
                <Button classes="w-full" onClick={onSubmit} disabled={isBusy} {isBusy}>
                    {localize('actions.send')}
                </Button>
            </popup-buttons>
        </form>
    </div>
</allot-mana-popup>
