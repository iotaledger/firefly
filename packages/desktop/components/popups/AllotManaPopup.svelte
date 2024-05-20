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
        convertToRawAmount,
        getUnitFromTokenMetadata,
    } from '@core/wallet'
    import { activeProfile, checkActiveProfileAuth, getNetworkHrp } from '@core/profile'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'
    import { onMount } from 'svelte'
    import { ManaBox } from '@components'
    import Big from 'big.js'
    import { validateBech32Address } from '@core/utils'
    import { AddressType } from '@iota/sdk/out/types'
    import { debounce } from '@core/utils'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let rawAmount: string = '0'
    export let accountAddress: string

    let isBusy = false
    let error: string
    let amount: string
    let assetAmountInput: AssetAmountInput

    const transactionUpdater = debounce(updateTransactionInfo, 500)
    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    let hasEnoughMana = false

    $: hasTransactionInProgress =
        $selectedWallet?.hasConsolidatingOutputsTransactionInProgress || $selectedWallet?.isTransferring
    $: asset = $visibleSelectedWalletAssets[$activeProfile?.network?.id].mana
    $: validAmount = Big(rawAmount ?? 0)?.gt(0)
    $: accountAddress, validAmount, amount, void preparedAllotMana()
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

    let updatingTransactionInfo = false
    function preparedAllotMana(): void {
        updatingTransactionInfo = true
        if (!updatingTransactionInfo) {
            transactionInfo.preparedTransaction = undefined
            transactionInfo.preparedTransactionError = undefined
        }
        transactionUpdater()
    }

    async function updateTransactionInfo(): Promise<void> {
        try {
            const accountId = AddressConverter.parseBech32Address(accountAddress)
            const _amount = convertToRawAmount(
                amount,
                asset?.metadata,
                getUnitFromTokenMetadata(asset?.metadata)
            )?.toString()
            transactionInfo.preparedTransaction = await $selectedWallet.prepareSendOutputs([], {
                ...getDefaultTransactionOptions(),
                manaAllotments: { [accountId]: Number(_amount) },
            })
            transactionInfo.preparedTransactionError = undefined
        } catch (error) {
            console.error(error)
            transactionInfo.preparedTransaction = undefined
            transactionInfo.preparedTransactionError = error
        } finally {
            updatingTransactionInfo = false
        }
    }

    async function allotMana(): Promise<void> {
        try {
            const accountId = AddressConverter.parseBech32Address(accountAddress)
            const _amount = convertToRawAmount(
                amount,
                asset?.metadata,
                getUnitFromTokenMetadata(asset?.metadata)
            )?.toString()
            await $selectedWallet.sendOutputs([], {
                ...getDefaultTransactionOptions(),
                manaAllotments: { [accountId]: Number(_amount) }, // if manaAllotments amount passed as bigint it is transformed to string in the sdk
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
                    <ManaBox {transactionInfo} bind:hasEnoughMana refreshTransactionInfo={updateTransactionInfo} />
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
