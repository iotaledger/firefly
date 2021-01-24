<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let locale
    export let mobile
    export let state
    export let totalBalance
    export let color = 'blue'
    export let WalletState
</script>

<div class="bg-gradient-to-b from-{color}-500 to-{color}-600 dark:from-gray-800 dark:to-gray-900 rounded-t-2xl pt-10 pb-12 px-8">
    <!-- Balance -->
    <div data-label="total-balance">
        <Text type="p" overrideColor smaller classes="text-white mb-2">{locale('general.total_balance')}</Text>
        <Text type="h2" overrideColor classes="text-white mb-2">{totalBalance.balance}</Text>
        <Text type="p" overrideColor smaller classes="text-{color}-300">{totalBalance.balanceEquiv}</Text>
    </div>
    {#if state === WalletState.Init}
        <!-- Incoming/Outgoing -->
        <div data-label="total-movements" class="flex flex-row justify-between mt-10">
            <div class="flex items-center">
                <Icon boxed icon="arrow-down" classes="text-white" boxClasses="bg-{color}-300 dark:bg-gray-900 mr-4" />
                <div>
                    <Text type="p" classes="text-white mb-0.5">{totalBalance.incoming}</Text>
                    <Text type="p" overrideColor smaller classes="text-{color}-300">{locale('general.incoming')}</Text>
                </div>
            </div>
            <div class="flex items-center">
                <Icon boxed icon="arrow-up" classes="text-white" boxClasses="bg-{color}-300 dark:bg-gray-900 mr-4" />
                <div>
                    <Text type="p" classes="text-white mb-0.5">{totalBalance.outgoing}</Text>
                    <Text type="p" overrideColor smaller classes="text-{color}-300">{locale('general.outgoing')}</Text>
                </div>
            </div>
        </div>
    {/if}
</div>
