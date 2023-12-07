<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { getSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { getArchivedBaseTokens } from '@core/layer-2/helpers/getArchivedBaseTokens'
    import { getBaseToken } from '@core/profile'
    import { truncateString } from '@core/utils'
    import { formatTokenAmountPrecise } from '@core/wallet'
    import { Button, FontWeight, KeyValueBox, Spinner, Text, TextType } from 'shared/components'
    import { onMount } from 'svelte'

    let address: string | undefined = undefined
    let withdrawableAmount: number | undefined = undefined
    const isBusy = false
    const isWithdrawing = false

    function onCancelClick(): void {
        closePopup()
    }

    async function onWithdrawFromL2Click(): Promise<void> {
        // todo: implement withdrawing
        // await withdrawFunds(address)
    }

    onMount(async () => {
        address = getSelectedAccount().depositAddress
        withdrawableAmount = await getArchivedBaseTokens(address)
    })
</script>

<div class="flex flex-col space-y-6">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} lineHeight="6">
        {localize('popups.withdrawFromL2.title')}
    </Text>
    <Text fontSize="15" color="gray-700" classes="text-left">{localize('popups.withdrawFromL2.body')}</Text>
    {#if address}
        <KeyValueBox
            classes="flex items-center w-full py-4"
            keyText={truncateString(address, 15, 15)}
            valueText={formatTokenAmountPrecise(withdrawableAmount, getBaseToken())}
        />
    {:else}
        <div class="flex items-center justify-center">
            <Spinner />
        </div>
    {/if}
    <div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
        <Button classes="w-full" outline onClick={onCancelClick} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            classes="w-full"
            onClick={onWithdrawFromL2Click}
            disabled={isBusy || isWithdrawing || !withdrawableAmount}
            {isBusy}
            busyMessage={localize('popups.withdrawFromL2.withdrawing')}
        >
            {localize('popups.withdrawFromL2.withdraw')}
        </Button>
    </div>
</div>
