<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Icon } from 'shared/components'
    import features from '../../../../features/features'
    import { updateActiveWalletTab, WalletTab } from '../../../../lib/contexts/wallet'

    const NAVIGATION_ITEMS: { icon: IconEnum; label: string; tab: WalletTab }[] = [
        ...(features?.tokens?.enabled
            ? [
                  {
                      icon: IconEnum.Tokens,
                      label: localize('tabs.tokens'),
                      tab: WalletTab.Tokens,
                  },
              ]
            : []),
        ...(features?.activity?.enabled
            ? [
                  {
                      icon: IconEnum.Tokens,
                      label: localize('tabs.activity'),
                      tab: WalletTab.Activity,
                  },
              ]
            : []),
    ]

    function onNavigationItemClick(tab: WalletTab): void {
        updateActiveWalletTab(tab)
    }
</script>

<div class="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-elevation-1 flex justify-between items-center">
    {#each NAVIGATION_ITEMS as item}
        <button
            class="flex flex-col items-center justify-center px-4 text-14 text-gray-500 dark:text-gray-400 border-b-2 border-transparent hover:text-gray-700 dark:hover:text-gray-300"
            on:click={() => onNavigationItemClick(item.tab)}
        >
            <Icon icon={item.icon} />
            <span class="ml-2">{item.label}</span>
        </button>
    {/each}
</div>
