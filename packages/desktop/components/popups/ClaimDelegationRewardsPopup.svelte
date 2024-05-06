<script lang="ts">
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { ManaBox } from '@components'
    import { openUrlInBrowser } from '@core/app'
    import { handleError } from '@core/error/handlers'
    import { localize } from '@core/i18n'
    import { DEFAULT_MANA, ITransactionInfoToCalculateManaCost } from '@core/network'
    import { getOfficialExplorerUrl } from '@core/network/utils'
    import { activeProfile, updateActiveWallet } from '@core/profile'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import {
        formatTokenAmountBestMatch,
        getDefaultTransactionOptions,
        hasWalletMainAccountNegativeBIC,
        selectedWallet,
    } from '@core/wallet'
    import { Button, FontWeight, KeyValueBox, Text, TextHint, TextHintVariant, TextType } from '@ui'
    import { onMount } from 'svelte'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let delegationId: string
    export let rewards: number
    export let isBusy = false

    let hasEnoughMana = false
    const transactionInfo: ITransactionInfoToCalculateManaCost = {}
    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)

    async function onConfirmClick(): Promise<void> {
        isBusy = true
        try {
            updatePopupProps({ isBusy })
            await checkActiveProfileAuth(burnDelegationOutput, { stronghold: true })
        } catch (error) {
            console.error(error)
        } finally {
            isBusy = false
        }
    }

    async function burnDelegationOutput(): Promise<void> {
        try {
            await $selectedWallet.burn({ delegations: [delegationId] }, getDefaultTransactionOptions())
            updateActiveWallet($selectedWallet.id, {
                hasDelegationRewardClaimTransactionInProgress: true,
                isTransferring: true,
            })
        } catch (err) {
            handleError(err)
        }
    }

    async function prepareBurnDelegationOutput(): Promise<void> {
        try {
            transactionInfo.preparedTransaction = await $selectedWallet?.prepareBurn(
                { delegations: [delegationId] },
                getDefaultTransactionOptions()
            )
        } catch (error) {
            console.error(error)
            transactionInfo.preparedTransactionError = error
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    function onExplorerClick(): void {
        openUrlInBrowser(`${explorerUrl}/search/${delegationId}`)
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareBurnDelegationOutput()
        } catch (err) {
            handleError(err.error)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.claimDelegationRewards.title')}
    </Text>
    <button
        class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
        on:click={onExplorerClick}
    >
        {localize('general.viewOnExplorer')}
    </button>
    <div class="flex flex-col space-y-4">
        <KeyValueBox keyText={localize('popups.claimDelegationRewards.delegationId')} valueText={delegationId} />
        <KeyValueBox
            keyText={localize('popups.claimDelegationRewards.rewards')}
            valueText={formatTokenAmountBestMatch(Math.round(rewards), DEFAULT_MANA)}
        />
        <ManaBox {transactionInfo} bind:hasEnoughMana />
        {#if hasMainAccountNegativeBIC}
            <TextHint variant={TextHintVariant.Danger} text={localize('popups.transaction.negativeBIC')} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            disabled={$selectedWallet?.isTransferring || isBusy || !hasEnoughMana || hasMainAccountNegativeBIC}
            isBusy={$selectedWallet?.isTransferring || isBusy}
            onClick={onConfirmClick}
        >
            {localize('popups.claimDelegationRewards.confirmButton')}
        </Button>
    </popup-buttons>
</div>
