<script lang="ts">
    import { Button, Text, FontWeight, TextType, KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { getDefaultTransactionOptions, selectedWallet } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { PreparedTransaction } from '@iota/sdk/out/types'
    import { ManaBox } from '@components'

    export let delegationId: string
    export let rewards: number

    let isBusy = false
    let hasEnoughMana = false
    let preparedTransaction: PreparedTransaction

    async function onConfirmClick(): Promise<void> {
        try {
            isBusy = true
            await checkActiveProfileAuth(
                async () => {
                    const burnOutput = await $selectedWallet.burn(
                        { delegations: [delegationId] },
                        getDefaultTransactionOptions()
                    )
                    if (burnOutput) {
                        closePopup()
                    }
                },
                { stronghold: true }
            )
        } catch (error) {
            console.error(error)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.claimDelegationRewards.title')}
    </Text>
    <div class="flex flex-col space-y-4">
        <KeyValueBox keyText={localize('popups.claimDelegationRewards.delegationId')} valueText={delegationId} />
        <KeyValueBox keyText={localize('popups.claimDelegationRewards.rewards')} valueText={rewards.toString()} />
        <ManaBox {preparedTransaction} bind:hasEnoughMana />
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
