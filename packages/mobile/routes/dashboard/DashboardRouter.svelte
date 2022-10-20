<script lang="typescript">
    import { TopBar } from '../../components'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'
    import features from '../../features/features'
    import { activeWalletTab, WALLET_TAB_COMPONENT } from '../../lib/contexts/wallet'
    import { Button, TogglableAmountLabel } from 'shared/components'
    import { TabNavigator } from './wallet/tabs'

    $: activeWalletTabComponent = WALLET_TAB_COMPONENT[$activeWalletTab]
</script>

{#if $selectedAccount}
    <div class="flex flex-col w-screen h-screen bg-gray-50 dark:bg-gray-900">
        <div class="px-5 py-6">
            <TopBar />
            {#if features?.balance?.enabled}
                <div class="flex justify-center w-full mt-5">
                    <TogglableAmountLabel
                        amount={$selectedAccount.balances?.baseCoin?.available}
                        tokenMetadata={BASE_TOKEN[$activeProfile?.networkProtocol]}
                    />
                </div>
            {/if}
            {#if features?.wallet?.sendAndReceive?.enabled}
                <div class="flex flex-row items-center justify-center w-full space-x-2 mt-8">
                    <Button classes="w-1/2 h-10">
                        {localize('actions.send')}
                    </Button>
                    <Button classes="w-1/2 h-10">
                        {localize('actions.receive')}
                    </Button>
                </div>
            {/if}
        </div>
        {#if activeWalletTabComponent}
            <div class="relative flex flex-col flex-auto w-full">
                <div class="flex-auto">
                    <svelte:component this={WALLET_TAB_COMPONENT[$activeWalletTab]} />
                </div>
                <TabNavigator />
            </div>
        {/if}
    </div>
{/if}
