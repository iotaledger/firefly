<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedWallet, hasWalletMainAccountNegativeBIC } from '@core/wallet'
    import { TextHintVariant } from '@ui/enums'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile'
    import { ManaBox } from '@components'
    import { consolidateOutputs } from '@core/wallet/actions/consolidateOutputs'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}

    let isBusy = false
    let hasError = false
    let hasEnoughMana = false

    $: confirmAllowed =
        !$selectedWallet?.isTransferring &&
        !isBusy &&
        hasEnoughMana &&
        !hasError &&
        !hasMainAccountNegativeBIC &&
        transactionInfo.preparedTransaction &&
        !transactionInfo.preparedTransactionError

    $: displayManaBox = !hasError && !$selectedWallet?.isTransferring
    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)

    async function prepareConsolidateTransaction(): Promise<void> {
        try {
            transactionInfo.preparedTransaction = await $selectedWallet.prepareConsolidateOutputs({
                force: false,
                outputThreshold: 2,
                targetAddress: $selectedWallet.depositAddress,
            })
        } catch (error) {
            if (error.message.includes('slots remaining until enough mana')) {
                transactionInfo.preparedTransactionError = error
            } else {
                hasError = true
                handleError(error)
            }
        }
    }

    async function onConsolidateClick(): Promise<void> {
        try {
            isBusy = true
            await checkActiveProfileAuth(
                async () => {
                    await consolidateOutputs()
                    closePopup()
                },
                { stronghold: true }
            )
        } catch (err) {
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareConsolidateTransaction()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.minimizeStorageDeposit.title')}
    </Text>
    <div class="space-y-4">
        <TextHint variant={TextHintVariant.Info} text={localize('popups.minimizeStorageDeposit.description')} />
        {#if displayManaBox}
            <ManaBox {transactionInfo} bind:hasEnoughMana />
        {/if}
        {#if hasMainAccountNegativeBIC}
            <TextHint variant={TextHintVariant.Danger} text={localize('popups.transaction.negativeBIC')} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            variant={ButtonVariant.Primary}
            disabled={!confirmAllowed}
            isBusy={$selectedWallet?.isTransferring || isBusy}
            onClick={onConsolidateClick}
        >
            {localize('popups.minimizeStorageDeposit.confirmButton')}
        </Button>
    </popup-buttons>
</div>
