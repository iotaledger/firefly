<script lang="ts">
    import { AccountLabel, Icon } from '@ui'

    import { selectedAccount } from '@core/account'

    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DrawerId, drawersStore, openDrawer } from '@/auxiliary/drawer'

    $: isDrawerOpen = $drawersStore.find((drawer) => drawer.id === DrawerId.AccountSwitcher)
</script>

<button
    on:click={() => openDrawer(DrawerId.AccountSwitcher)}
    class="flex flex-row justify-center items-center space-x-2"
>
    <AccountLabel account={$selectedAccount} />
    <div class="transform {isDrawerOpen ? 'rotate-180' : 'rotate-0'}">
        <Icon height="18" width="18" icon={IconEnum.ChevronDown} classes="text-gray-500 dark:text-white" />
    </div>
</button>
