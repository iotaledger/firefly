<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { selectedAccountAssets } from '@core/wallet'
    import { AccountActionsButton, Text, TogglableAssetBalanceLabel } from 'shared/components'

    export let classes = ''

    $: fomattedNetworkName = $nodeInfo?.protocol?.networkName
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ')
    $: ({ baseCoin } = $selectedAccountAssets)
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
                {localize('general.balanceWithNetwork', { values: { network: fomattedNetworkName } })}
            </Text>
            <AccountActionsButton />
        </div>
    {/if}
    <div class="flex flex-col flex-wrap items-start space-y-1">
        <TogglableAssetBalanceLabel asset={baseCoin} />
    </div>
</div>
