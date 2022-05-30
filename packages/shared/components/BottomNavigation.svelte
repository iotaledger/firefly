<script lang="typescript">
    import { BottomNavigationTab } from 'shared/components'
    import { WalletRoute, walletRouter, BottomNavigationTab as BottomNavigationType } from '@core/router'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    const tabs: BottomNavigationType[] = [
        {
            icon: 'wallet',
            label: locale('tabs.tokens'),
            route: WalletRoute.Assets,
            onClick: openAssets,
        },
        {
            icon: 'activity',
            label: locale('tabs.activity'),
            route: WalletRoute.AccountHistory,
            onClick: openAccountHistory,
        },
    ]

    function openAssets() {
        $walletRouter.goTo(WalletRoute.Assets)
    }
    function openAccountHistory() {
        $walletRouter.goTo(WalletRoute.AccountHistory)
    }
</script>

<div class="absolute w-full bottom-0">
    <div class="nav-wrapper flex flex-row justify-center pt-4 space-x-24 bg-white dark:bg-gray-900 shadow-elevation-4">
        {#each tabs as tab}
            <BottomNavigationTab {tab} />
        {/each}
    </div>
</div>

<style>
    .nav-wrapper {
        padding-bottom: calc(env(safe-area-inset-bottom) + 15px);
    }
</style>
