<script lang="typescript">
    import type { WalletAccount } from 'lib/typings/wallet'
    import { Drawer, Icon, Text } from 'shared/components'
    import { AccountSwitcher, AccountCreation } from 'shared/components/drawerContent'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount = (..._: any[]): void => {}

    enum DrawerRoutes {
        Init = 'init',
        Create = 'create',
    }

    let drawer: Drawer
    let showDrawer = false
    let drawerRoute = DrawerRoutes.Init

    function toggleAccountSwitcher(): void {
        setDrawerRoute(DrawerRoutes.Init)
        showDrawer = !showDrawer
        drawer?.open()
    }

    function setDrawerRoute(route: DrawerRoutes): void {
        drawerRoute = route
    }
</script>

<div class="flex flex-auto flex-col">
    <button
        on:click={toggleAccountSwitcher}
        class="mt-3 p-2 pl-4 fixed rounded-xl flex flex-row justify-center items-center space-x-2 {showDrawer
            ? 'bg-gray-100 dark:bg-gray-900'
            : ''}"
    >
        <span class="circle" style="--account-color: {getColor($activeProfile, $selectedAccount?.id)}" />
        <Text type="h4">{$selectedAccount?.alias}</Text>
        <div class="transform transition-transform {showDrawer ? 'rotate-180' : 'rotate-0'}">
            <Icon height="18" width="18" icon="chevron-down" classes="text-gray-800 dark:text-white" />
        </div>
    </button>
    <Drawer opened={showDrawer} bind:this={drawer} onClose={() => (showDrawer = false)}>
        {#if drawerRoute === 'create'}
            <AccountCreation {onCreateAccount} onCancel={() => drawer.close()} />
        {:else if (drawerRoute = DrawerRoutes.Init)}
            <AccountSwitcher
                {accounts}
                {onCreateAccount}
                handleCreateAccountPress={() => setDrawerRoute(DrawerRoutes.Create)}
                onAccountSelection={() => drawer.close()}
            />
        {/if}
    </Drawer>
</div>

<style type="text/scss">
    button {
        left: 50%;
        transform: translatex(-50%);
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>
