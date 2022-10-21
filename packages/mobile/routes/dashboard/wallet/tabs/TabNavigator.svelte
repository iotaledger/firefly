<script lang="typescript">
    import { appSettings } from '@core/app'
    import { localize } from '@core/i18n'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Icon } from 'shared/components'
    import features from '../../../../features/features'
    import { activeWalletTab, updateActiveWalletTab, WalletTab } from '../../../../lib/contexts/wallet'

    $: darkModeEnabled = $appSettings.darkMode

    const NAVIGATION_ITEMS: { icon: IconEnum; label: string; tab: WalletTab }[] = [
        ...(features?.wallet?.tokens?.enabled
            ? [
                  {
                      icon: IconEnum.Tokens,
                      label: localize('tabs.tokens'),
                      tab: WalletTab.Tokens,
                  },
              ]
            : []),
        ...(features?.wallet?.activity?.enabled
            ? [
                  {
                      icon: IconEnum.Activity,
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

<tab-navigator
    class="w-full bg-white dark:bg-gray-800 grid grid-cols-{NAVIGATION_ITEMS.length} grid-rows-1 gap-4 pt-4 pb-7 px-5"
    class:darkmode={darkModeEnabled}
>
    {#each NAVIGATION_ITEMS as item}
        <div
            class="relative flex flex-col items-center justify-center text-center font-semibold text-11 {$activeWalletTab ===
            item.tab
                ? 'text-blue-500'
                : 'text-gray-500'}"
            on:click={() => onNavigationItemClick(item.tab)}
        >
            <Icon width={24} height={24} icon={item.icon} />
            <span class="overflow-hidden overflow-ellipsis w-full">{item.label}</span>
        </div>
    {/each}
</tab-navigator>

<style type="text/scss">
    tab-navigator {
        box-shadow: 0px 4px 4px rgb(0 0 0 / 25%), 0px 2px 12px rgb(0 25 66 / 16%);
        &.darkmode {
            box-shadow: 0px 4px 4px rgb(0 0 0 / 25%), 0px 2px 12px rgb(0 25 66 / 30%);
        }
    }
</style>
