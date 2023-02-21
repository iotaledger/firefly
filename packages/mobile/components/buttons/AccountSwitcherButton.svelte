<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { selectedAccount } from '@core/account'
    import { Icon } from 'shared/components'
    import { AccountLabel } from 'shared/components/atoms/'
    import { DrawerId, drawersStore, openDrawer } from '../../lib/auxiliary/drawer'

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
