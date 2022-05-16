<script lang="typescript">
    import { Text, AccountActionsButton, ReceiveButton, SendButton, TogglableAmountLabel } from 'shared/components'
    import { Unit } from '@iota/unit-converter'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccount } from '@core/account'

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
        <TogglableAmountLabel value={$selectedAccount?.balances.available} />
        <Text smaller>
            {formatUnitPrecision($selectedAccount?.balances.available, Unit.Mi)}
        </Text>
    </div>
    <div class="flex flex-row space-x-4">
        <ReceiveButton />
        <SendButton />
    </div>
</div>
