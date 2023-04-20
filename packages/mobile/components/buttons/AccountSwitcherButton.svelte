<script lang="ts">
    import { AccountLabel, Icon } from '@ui'

    import { selectedAccount } from '@core/account'

    import { DrawerId, drawers, openDrawer } from '@/auxiliary/drawer'
    import { Icon as IconEnum } from '@auxiliary/icon'

    $: isDrawerOpen = $drawers.find((drawer) => drawer.id === DrawerId.AccountSwitcher)
</script>

<button
    on:click={() => openDrawer(DrawerId.AccountSwitcher)}
    class="flex flex-row justify-center items-center space-x-2"
>
    <AccountLabel fontSize="16" account={$selectedAccount} />
    <div class="transform {isDrawerOpen ? 'rotate-180' : 'rotate-0'}">
        <Icon height="18" width="18" icon={IconEnum.ChevronDown} classes="text-gray-500 dark:text-white" />
    </div>
</button>
