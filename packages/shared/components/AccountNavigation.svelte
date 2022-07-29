<script lang="typescript">
    import { backButtonStore } from '@core/router'
    import { activeProfile, getAccountColor } from '@lib/profile'
    import { AccountColor } from '@lib/typings/color'
    import { createAccountCallback, WalletAccount } from '@lib/typings/wallet'
    import { selectedAccountStore } from '@lib/wallet'
    import { Drawer, Icon, Text } from 'shared/components'
    import { AccountSwitcher } from 'shared/components/drawerContent'
    import CreateAccount from 'shared/components/popups/CreateAccount.svelte'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount: createAccountCallback

    enum DrawerRoutes {
        Init = 'init',
        Create = 'create',
    }

    let drawer: Drawer
    let isDrawerOpened = false
    let drawerRoute = DrawerRoutes.Init

    let switcherButtonWidth: number = 0
    let switcherButtonTranslateX = 0

    const VIEWPORT_PADDING = 20

    let accountColor: string | AccountColor

    $: $activeProfile?.accounts, (accountColor = getAccountColor($selectedAccountStore?.id))
    $: switcherButtonWidth, updateSwitcherButtonTranslate()

    function updateSwitcherButtonTranslate(): void {
        if (!switcherButtonWidth || !window) return
        const centeredTranslate = window.innerWidth * 0.5 - switcherButtonWidth * 0.5
        switcherButtonTranslateX = centeredTranslate <= VIEWPORT_PADDING ? VIEWPORT_PADDING : centeredTranslate
    }

    function toggleAccountSwitcher(): void {
        setDrawerRoute(DrawerRoutes.Init)
        isDrawerOpened = !isDrawerOpened
        if (drawer) {
            drawer.open()
            $backButtonStore.add(drawer.close)
        }
    }

    function setDrawerRoute(route: DrawerRoutes): void {
        drawerRoute = route
    }
</script>

<div class="flex flex-auto flex-col">
    <button
        on:click={toggleAccountSwitcher}
        class="mt-3 py-2 px-2 absolute rounded-lg flex flex-row justify-center items-center space-x-2 
            {isDrawerOpened ? 'bg-gray-100 dark:bg-gray-900' : ''}
            "
        style="transform: translateX({switcherButtonTranslateX}px);"
        bind:clientWidth={switcherButtonWidth}
    >
        <span class="circle" style="--account-color: {accountColor}" />
        <Text type="h4">{$selectedAccountStore?.alias}</Text>
        <div class="transform transition-transform {isDrawerOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon="chevron-down" height="18" width="18" classes="text-gray-800 dark:text-white" />
        </div>
    </button>
    <Drawer bind:this={drawer} opened={isDrawerOpened} on:close={() => (isDrawerOpened = false)}>
        <div class="flex flex-col w-full pt-7 p-5 safe-area">
            {#if drawerRoute === DrawerRoutes.Create}
                <CreateAccount onCreate={onCreateAccount} onCancel={() => drawer.close()} />
            {:else if drawerRoute === DrawerRoutes.Init}
                <AccountSwitcher
                    {accounts}
                    {onCreateAccount}
                    handleCreateAccountPress={() => setDrawerRoute(DrawerRoutes.Create)}
                    onAccountSelection={() => drawer.close()}
                />
            {/if}
        </div>
    </Drawer>
</div>

<style type="text/scss">
    button {
        .circle {
            @apply rounded-full;
            @apply w-3;
            @apply h-3;
            background-color: var(--account-color);
        }
    }
    .safe-area {
        margin-bottom: calc(env(safe-area-inset-top) / 2);
    }
</style>
