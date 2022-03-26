<script lang="typescript">
    import type { WalletAccount } from 'lib/typings/wallet'
    import { AccountSwitcherModal, Icon, Text, Drawer } from 'shared/components'
    import { AccountSwitcher, AccountCreation } from 'shared/components/drawerContent'
    import { mobile } from 'shared/lib/app'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { selectedAccount } from 'shared/lib/wallet'
    import { isBright } from 'shared/lib/helpers'

    export let accounts: WalletAccount[] = []
    export let onAccountCreation = (..._: any[]): void => {}

    $: color = getColor($activeProfile, $selectedAccount?.id) as string
    $: textColor = isBright(color) ? 'gray-800' : 'white'

    enum DrawerRoutes {
        Init = 'init',
        Create = 'create',
    }

    let drawer: Drawer
    let showModal = false
    let showDrawer = false
    let drawerRoute = DrawerRoutes.Init

    function toggleAccountSwitcher(): void {
        if ($mobile) {
            setDrawerRoute(DrawerRoutes.Init)
            showDrawer = !showDrawer
            return drawer.open()
        }
        showModal = !showModal
    }

    function setDrawerRoute(route: DrawerRoutes): void {
        drawerRoute = route
    }
</script>

<div class="flex flex-auto flex-col">
    <button on:click={toggleAccountSwitcher} class="flex flex-row justify-center items-center space-x-2">
        {#if !$mobile}
            <div class="circle" style="--account-color: {getColor($activeProfile, $selectedAccount?.id)};" />
        {/if}
        <Text type="h4" classes="text-{textColor}">{$selectedAccount?.alias}</Text>
        <div class="transform transition-all {showModal ? 'rotate-180' : 'rotate-0'}">
            <Icon
                height="18"
                width="18"
                icon="chevron-down"
                classes={$mobile ? `text-${textColor}` : 'text-gray-800 dark:text-white'}
            />
        </div>
    </button>
    <Drawer opened={showDrawer} bind:this={drawer} onClose={() => (showDrawer = false)}>
        {#if drawerRoute === 'create'}
            <AccountCreation {onAccountCreation} onCancel={() => drawer.close()} />
        {:else if (drawerRoute = DrawerRoutes.Init)}
            <AccountSwitcher
                handleCreateAccountPress={() => setDrawerRoute(DrawerRoutes.Create)}
                onAccountSelection={() => drawer.close()}
                {accounts}
            />
        {/if}
    </Drawer>
</div>
<AccountSwitcherModal {onAccountCreation} {accounts} bind:isActive={showModal} />

<style type="text/scss">
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
</style>
