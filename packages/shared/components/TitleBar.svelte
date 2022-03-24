<script lang="typescript">
    import { onDestroy, onMount } from 'svelte'
    import { appSettings } from 'shared/lib/appSettings'
    import { Platform } from 'shared/lib/platform'
    import { popupState } from 'shared/lib/popup'
    import { wallet } from 'shared/lib/wallet'
    import tailwindConfig from 'shared/tailwind.config.js'
    import resolveConfig from 'tailwindcss/resolveConfig'
    import { dashboardRoute, DashboardRoute } from '@core/router'

    const { accountsLoaded } = $wallet

    $: showingDashboard = $accountsLoaded && $popupState.type !== 'busy'
    $: showingPopup = $popupState.active && $popupState.type !== 'busy'
    $: showingSettings = $dashboardRoute === DashboardRoute.Settings

    let os = ''
    let isMaximized = false

    $: darkModeEnabled = $appSettings.darkMode

    const fullConfig = resolveConfig(tailwindConfig)

    onMount(async () => {
        os = await Platform.getOS()
        isMaximized = await Platform.isMaximized()
        document.body.classList.add(`platform-${os}`)
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.addEventListener('resize', handleResize)
    })

    onDestroy(() => {
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.removeEventListener('resize', handleResize)
    })

    async function handleResize() {
        isMaximized = await Platform.isMaximized()
    }
</script>

<div class="h-full w-full">
    {#if os === 'win32'}
        <nav
            class={`fixed z-10 left-0 right-0 top-0 flex flex-row h-12 justify-between ${
                showingDashboard && !showingSettings ? 'bg-gray-50' : 'bg-white'
            } dark:bg-gray-900`}
        >
            <div class="absolute left-16 top-1 right-36 h-9" style="-webkit-app-region: drag" />
            <button
                on:click={() => Platform.popupMenu()}
                class={`flex justify-center p-4 stroke-current text-gray-500 dark:text-gray-100 w-20 ${
                    showingDashboard
                        ? 'bg-white dark:bg-gray-800 border-solid border-r border-gray-100 dark:border-gray-800'
                        : ''
                }`}
                style="-webkit-app-region: none"
            >
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <rect y="2" width="16" height="1" rx="0.5" fill="currentColor" />
                    <rect y="7" width="16" height="1" rx="0.5" fill="currentColor" />
                    <rect y="12" width="16" height="1" rx="0.5" fill="currentColor" />
                </svg>
            </button>
            <div class="flex flex-row mr-3">
                <button
                    on:click={() => Platform.minimize()}
                    class="p-2 mr-2 stroke-current text-gray-500 dark:text-gray-100"
                    style="-webkit-app-region: none"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <rect x="2" y="8" width="12" height="1" rx="0.5" fill="currentColor" />
                    </svg>
                </button>
                <button
                    on:click={async () => (isMaximized = await Platform.maximize())}
                    class="p-2 mr-2 stroke-current text-gray-500 dark:text-gray-100 fill-current"
                    style="-webkit-app-region: none"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {#if isMaximized}
                            <rect x="4.5" y="0.5" width="11" height="11" stroke="currentColor" stroke-width="1.5" />
                            <rect
                                x="0.5"
                                y="4.5"
                                width="11"
                                height="11"
                                stroke="currentColor"
                                stroke-width="1.5"
                                fill={darkModeEnabled
                                    ? fullConfig.theme.colors.gray['900']
                                    : showingDashboard && !showingSettings
                                    ? fullConfig.theme.colors.gray['50']
                                    : fullConfig.theme.colors.white}
                            />
                        {:else}
                            <rect
                                x="2.5"
                                y="2.5"
                                width="11"
                                height="11"
                                rx="0.5"
                                stroke="currentColor"
                                stroke-width="1.5"
                            />
                        {/if}
                    </svg>
                </button>
                <button
                    on:click={() => Platform.close()}
                    class="p-2 mr-2 stroke-current text-gray-500 dark:text-gray-100"
                    style="-webkit-app-region: none"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <path
                            d="M3.35355 2.64645C3.15829 2.45118 2.84171 2.45118 2.64645 2.64645C2.45118 2.84171 2.45118 3.15829 2.64645 3.35355L3.35355 2.64645ZM12.6463 13.3534C12.8415 13.5486 13.1581 13.5486 13.3534 13.3534C13.5486 13.1581 13.5486 12.8415 13.3534 12.6463L12.6463 13.3534ZM2.64645 3.35355L12.6463 13.3534L13.3534 12.6463L3.35355 2.64645L2.64645 3.35355Z"
                            fill="currentColor"
                        />
                        <path
                            d="M13.3536 3.35374C13.5488 3.15847 13.5488 2.84189 13.3536 2.64663C13.1583 2.45137 12.8417 2.45137 12.6464 2.64663L13.3536 3.35374ZM2.64663 12.6464C2.45137 12.8417 2.45137 13.1583 2.64663 13.3535C2.8419 13.5488 3.15848 13.5488 3.35374 13.3535L2.64663 12.6464ZM12.6464 2.64663L2.64663 12.6464L3.35374 13.3535L13.3536 3.35374L12.6464 2.64663Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>
            </div>
            {#if showingPopup}
                <div class="fixed z-10 left-0 right-0 h-12 bg-gray-800 opacity-40" />
            {/if}
        </nav>
    {/if}
    {#if os === 'darwin'}
        <div style="-webkit-app-region: drag" class="w-full h-8 fixed left-20" />
    {/if}
    <div class={`fixed ${os === 'win32' ? 'top-12' : 'top-0'} left-0 right-0 bottom-0`}>
        <slot />
    </div>
</div>
