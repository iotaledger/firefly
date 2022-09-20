<script lang="typescript">
    import { AccountActionsButton, Text, TogglableAmountLabel } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let classes = ''
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
        <TogglableAmountLabel
            amount={$selectedAccount?.balances.baseCoin.available}
            tokenMetadata={BASE_TOKEN[$activeProfile?.networkProtocol]}
        />
    </div>
</div>
