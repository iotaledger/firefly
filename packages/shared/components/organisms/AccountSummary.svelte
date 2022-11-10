<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatTokenAmountBestMatch, selectedAccountAssets } from '@core/wallet'
    import { AccountActionsButton, FontWeight, Text, TextType, TogglableAmountLabel } from 'shared/components'

    export let classes = ''

    $: ({ metadata, balance } = $selectedAccountAssets?.baseCoin)
</script>

<div
    class=" 
        relative p-6 space-y-4
        {$mobile ? 'pb-0 bg-transparent' : ''} 
        {classes}
    "
>
    {#if !$mobile}
        <div class="flex flex-row items-center justify-between">
            <Text type="h5" classes="text-left">
                {localize('general.balance')}
            </Text>
            <AccountActionsButton />
        </div>
    {/if}
    <div class="flex flex-col flex-wrap items-start space-y-1">
        <TogglableAmountLabel amount={balance?.total} tokenMetadata={metadata} />
        <Text type={TextType.p} fontWeight={FontWeight.medium}>
            {localize('general.availableBalanceWithValue', {
                values: { balance: formatTokenAmountBestMatch(balance?.available, metadata) },
            })}
        </Text>
    </div>
</div>
