<script lang="typescript">
    import { AccountActionsButton, ReceiveButton, SendButton, TogglableAmountLabel } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { selectedAccount } from '@core/account'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let classes = ''
</script>

<div
    class="bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative p-6 space-y-6 {$mobile
        ? 'pb-0 bg-transparent'
        : 'pb-12'} {classes}"
>
    {#if !$mobile}
        <div class="flex flex-row items-center justify-between">
            <p class="text-11 leading-120 text-gray-800 dark:text-white uppercase tracking-widest">
                {localize('general.balance')}
            </p>
            <AccountActionsButton />
        </div>
    {/if}
    <div class="flex flex-col flex-wrap items-start space-y-1.5">
        <TogglableAmountLabel
            amount={$selectedAccount?.balances.available}
            tokenMetadata={BASE_TOKEN[$activeProfile?.networkProtocol]}
        />
    </div>
    <div class="flex flex-row space-x-4">
        <ReceiveButton />
        <SendButton />
    </div>
</div>
