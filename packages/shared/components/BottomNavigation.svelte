<script lang="typescript">
    import { BottomNavigationTab } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { BottomNavigationTab as BottomNavigationType, WalletRoute, walletRouter } from '@core/router'

    export let locale: Locale

    let height = 0

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

    export function getHeight(): number {
        return height
    }
</script>

<div class="w-full bottom-0 z-10" bind:clientHeight={height}>
    <div class="nav-wrapper flex flex-row justify-center pt-4 space-x-24 bg-white dark:bg-gray-900 shadow-elevation-4">
        {#each tabs as tab}
            <BottomNavigationTab {tab} />
        {/each}
    </div>
</div>

<style>
    .nav-wrapper {
        padding-bottom: calc(env(safe-area-inset-bottom) / 2 + 15px);
    }
</style>
