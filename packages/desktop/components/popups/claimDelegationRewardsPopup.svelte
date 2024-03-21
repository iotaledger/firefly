<script lang="ts">
    import { Button, Text, FontWeight, TextType, KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup, updatePopupProps } from '@auxiliary/popup'
    import { getDefaultTransactionOptions, selectedWallet, selectedWalletId } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { ManaBox } from '@components'
    import { onMount } from 'svelte'
    import { handleError } from '@core/error/handlers'
    import { updateActiveWallet } from '@core/profile'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}
    export let delegationId: string
    export let rewards: number
    export let isBusy = false

    let hasEnoughMana = false
    const transactionInfo: ITransactionInfoToCalculateManaCost = {}

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
            updateActiveWallet($selectedWalletId, {
                hasDelegationTransactionInProgress: true,
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
            transactionInfo.preparedTransactionError = error
        }
    }

    function onCancelClick(): void {
        closePopup()
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
    <div class="flex flex-col space-y-4">
        <KeyValueBox keyText={localize('popups.claimDelegationRewards.delegationId')} valueText={delegationId} />
        <KeyValueBox keyText={localize('popups.claimDelegationRewards.rewards')} valueText={rewards.toString()} />
        <ManaBox {transactionInfo} bind:hasEnoughMana />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            disabled={$selectedWallet?.isTransferring || isBusy || !hasEnoughMana}
            isBusy={$selectedWallet?.isTransferring || isBusy}
            onClick={onConfirmClick}
        >
            {localize('popups.claimDelegationRewards.confirmButton')}
        </Button>
    </popup-buttons>
</div>
