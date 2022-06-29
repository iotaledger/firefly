<script lang="typescript">
    import { mobileHeaderAnimation } from '@lib/animation'
    import { activeProfile, getAccountColor } from '@lib/profile'
    import { AccountColor } from '@lib/typings/color'
    import { createAccountCallback, WalletAccount } from '@lib/typings/wallet'
    import { selectedAccountStore } from '@lib/wallet'
    import { Drawer, Icon, Text } from 'shared/components'
    import { AccountSwitcher } from 'shared/components/drawerContent'
    import CreateAccount from 'shared/components/popups/CreateAccount.svelte'
    import { onDestroy } from 'svelte'

    export let accounts: WalletAccount[] = []
    export let onCreateAccount: createAccountCallback

    enum DrawerRoutes {
        Init = 'init',
        Create = 'create',
    }

    let drawer: Drawer
    let isDrawerOpened = false
    let drawerRoute = DrawerRoutes.Init
    let unsubscribeAnimateTranslationLeft = () => {}

    let accountColor: string | AccountColor
    $: $activeProfile?.accounts, (accountColor = getAccountColor($selectedAccountStore?.id))

    function toggleAccountSwitcher(): void {
        setDrawerRoute(DrawerRoutes.Init)
        isDrawerOpened = !isDrawerOpened
        drawer?.open()
    }

    function setDrawerRoute(route: DrawerRoutes): void {
        drawerRoute = route
    }

    function animateTranslationLeft(node: HTMLElement): void {
        unsubscribeAnimateTranslationLeft = mobileHeaderAnimation.subscribe((curr) => {
            const { width } = node.getBoundingClientRect()
            const centerPosition = window.innerWidth * 0.5 - width * 0.5
            const yOffset = 0.09
            const moveProgress = curr * (1 - yOffset) + yOffset
            node.style.transform = `translateX(${centerPosition * moveProgress}px)`
        })
    }

    onDestroy(() => {
        unsubscribeAnimateTranslationLeft()
    })
</script>

<div class="flex flex-auto flex-col">
    <button
        on:click={toggleAccountSwitcher}
        class="mt-3 py-2 fixed rounded-lg flex flex-row justify-center items-center space-x-2 
            {isDrawerOpened ? 'bg-gray-100 dark:bg-gray-900' : ''}
            "
        use:animateTranslationLeft
    >
        <span class="circle" style="--account-color: {accountColor}" />
        <Text type="h4">{$selectedAccountStore?.alias}</Text>
        <div class="transform transition-transform {isDrawerOpened ? 'rotate-180' : 'rotate-0'}">
            <Icon icon="chevron-down" height="18" width="18" classes="text-gray-800 dark:text-white" />
        </div>
    </button>
    <Drawer bind:this={drawer} opened={isDrawerOpened} onClose={() => (isDrawerOpened = false)}>
        <div class="flex flex-col px-6 w-full safe-area pt-7 pb-5 safe-area">
            {#if drawerRoute === 'create'}
                <CreateAccount onCreate={onCreateAccount} onCancel={() => drawer.close()} />
            {:else if (drawerRoute = DrawerRoutes.Init)}
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
