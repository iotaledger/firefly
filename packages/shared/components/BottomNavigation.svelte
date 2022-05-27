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
            icon: 'currency',
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
    <div class="flex flex-row justify-center pb-4 pt-4 space-x-24 bg-white shadow-elevation-4">
        {#each tabs as tab}
            <BottomNavigationTab {tab} />
        {/each}
    </div>
</div>
