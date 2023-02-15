<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Icon } from 'shared/components/atoms'
    import { appSettings, Platform, PlatformOption, platform } from '@core/app'
    import { activeProfile } from '@core/profile'
    import { appRoute, AppRoute } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { popupState } from '@auxiliary/popup'

    const { hasLoadedAccounts } = $activeProfile

    let isMaximized = false

    $: isDashboardVisible = $appRoute === AppRoute.Dashboard && $hasLoadedAccounts && $popupState.type !== 'busy'
    $: isWindows = $platform === PlatformOption.Windows
    $: dark = $appSettings.darkMode

    async function onResize(): Promise<void> {
        isMaximized = await Platform.isMaximized()
    }

    onMount(async () => {
        await onResize()
        document.body.classList.add(`platform-${$platform}`)
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.addEventListener('resize', onResize)
    })

    onDestroy(() => {
        /* eslint-disable @typescript-eslint/no-misused-promises */
        window.removeEventListener('resize', onResize)
    })
</script>

<title-bar class="block h-full w-full">
    <nav
        class:dark
        class:with-borders={isDashboardVisible}
        class="flex flex-row justify-between fixed z-10 top-0 left-0 right-0 w-full h-9 transition-none bg-transparent z-50"
    >
        {#if isWindows}
            <!-- We need to add this element to allow fix the windows resize area issue due to -webkit-app-region: drag -->
            <windows-resize-area />
            <button
                on:click={() => Platform.popupMenu()}
                class="flex justify-center items-center p-3 text-gray-500 dark:text-gray-100 w-20"
                type="button"
            >
                <Icon icon={IconEnum.Hamburger} />
            </button>
            <window-control-buttons class="flex flex-row justify-end space-x-4 w-36 pr-6">
                <button on:click={() => Platform.minimize()} class="p-2 text-gray-500 dark:text-gray-100" type="button">
                    <Icon icon={IconEnum.Minimize} />
                </button>
                <button
                    on:click={async () => (isMaximized = await Platform.maximize())}
                    class="p-2 text-gray-500 dark:text-gray-100"
                    type="button"
                >
                    {#if isMaximized}
                        <Icon icon={IconEnum.RestoreSize} />
                    {:else}
                        <Icon icon={IconEnum.Maximize} />
                    {/if}
                </button>
                <button on:click={() => Platform.close()} class="p-2 text-gray-500 dark:text-gray-100" type="button">
                    <Icon icon={IconEnum.CloseThin} />
                </button>
            </window-control-buttons>
        {/if}
    </nav>
    <slot-container
        class="block fixed left-0 right-0 bottom-0 z-10 top-0"
        class:top-placement={isWindows || isDashboardVisible}
    >
        <slot />
    </slot-container>
</title-bar>

<style lang="scss">
    windows-resize-area {
        @apply absolute block h-1 left-20 top-0;
        width: calc(100% - 14rem);
    }

    nav {
        -webkit-app-region: drag;

        > * {
            -webkit-app-region: none;
        }
    }

    nav.with-borders {
        @apply bg-gray-200 border-b border-gray-300 border-solid;

        &.dark {
            @apply bg-gray-1000 border-gray-1000;
        }
    }

    slot-container.top-placement {
        @apply top-9;
    }
</style>
