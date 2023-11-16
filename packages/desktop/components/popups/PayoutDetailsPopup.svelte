<script lang="ts">
    import { closePopup } from '@auxiliary/popup'
    import { IVestingPayout } from '@contexts/vesting'
    import { getFormattedTimeStamp, localize } from '@core/i18n'
    import { getBaseToken } from '@core/profile'
    import { truncateString } from '@core/utils'
    import { formatTokenAmountBestMatch } from '@core/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { Button, FontWeight, KeyValueBox, Text, TextType } from 'shared/components'

    export let payout: IVestingPayout

    function onCloseClick(): void {
        closePopup()
    }
</script>

<Text type={TextType.h4} fontSize="18" lineHeight="6" fontWeight={FontWeight.semibold} classes="mb-6">
    {localize('popups.payoutDetails.title')}
</Text>
<div class="space-y-4">
    <div class="w-full flex-col space-y-2 payout-details-wrapper">
        <VirtualList items={payout.amounts} let:item>
            <div class="mb-1">
                <KeyValueBox
                    isCopyable
                    classes="flex items-center w-full py-4"
                    keyText={truncateString(item?.address, 14, 14)}
                    valueText={formatTokenAmountBestMatch(Number(item?.amount), getBaseToken())}
                    copyValue={item.address}
                    backgroundColor="gray-50"
                    darkBackgroundColor="gray-900"
                />
            </div>
        </VirtualList>
        <KeyValueBox
            keyText={localize('popups.payoutDetails.amount')}
            valueText={formatTokenAmountBestMatch(payout.totalAmount, getBaseToken())}
        />
        <KeyValueBox
            keyText={localize('popups.payoutDetails.unlockDate')}
            valueText={getFormattedTimeStamp(payout.unlockTime)}
        />
        <KeyValueBox
            keyText={localize('popups.payoutDetails.status')}
            valueText={localize(`pills.vesting.${payout.status}`)}
        />
    </div>
</div>
<div class="flex flex-row flex-nowrap w-full space-x-4 mt-6">
    <Button classes="w-full" onClick={onCloseClick}>
        {localize('actions.close')}
    </Button>
</div>

<style lang="scss">
    .payout-details-wrapper :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
        min-height: 52px;
        max-height: 300px;
    }
    .payout-details-wrapper :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
