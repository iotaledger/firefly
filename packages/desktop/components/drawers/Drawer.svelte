<script lang="ts">
    import { fade, fly } from 'svelte/transition'
    import { Router } from '@core/router'
    import { closeDrawer, DrawerDirection, drawerState } from '@desktop/auxiliary/drawer'
    import { DrawerRoute } from '@desktop/routers'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { Icon } from '@ui'

    export let onClose: () => unknown = () => {}

    const DRAWER_ANIMATION_DURATION_MS = 200

    /* eslint-disable @typescript-eslint/no-unused-vars */
    let drawerRoute: DrawerRoute
    let drawerRouter: Router<DrawerRoute>
    /* eslint-enable @typescript-eslint/no-unused-vars */

    let direction: { x: number; y: number }
    let position: string
    let isVertical: boolean

    $: setDirection($drawerState.direction)
    function setDirection(drawerDirection: DrawerDirection): void {
        switch (drawerDirection) {
            case DrawerDirection.Bottom:
                direction = { x: 0, y: 100 }
                position = 'bottom-0'
                isVertical = false
                break
            case DrawerDirection.Top:
                direction = { x: 0, y: -100 }
                position = 'top-0'
                isVertical = false
                break
            case DrawerDirection.Left:
                direction = { x: -100, y: 0 }
                position = 'left-0'
                isVertical = true
                break
            case DrawerDirection.Right:
                direction = { x: 100, y: 0 }
                position = 'right-0'
                isVertical = true
                break
        }
    }

    function onCloseClick(): void {
        if (!$drawerState.preventClose) {
            onClose && onClose()
            closeDrawer()
        }
    }
</script>

{#if $drawerState.active}
    <drawer class="absolute top-0 left-0 w-full h-full z-30">
        <overlay
            in:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            on:click={onCloseClick}
            on:keydown={() => {}}
            class="fixed top-12 left-0 w-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
        />
        <panel
            in:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            class="relative flex flex-col bg-gray-50 dark:bg-gray-800 {position} {isVertical
                ? 'vertical'
                : 'horizontal'}"
        >
            <div class="flex flex-col h-full">
                <!-- here would go the different drawers -->
            </div>

            {#if !$drawerState.hideClose}
                <button on:click={onCloseClick} class="absolute top-7 right-7 focus:text-blue-500">
                    <Icon
                        icon={IconEnum.Close}
                        classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                    />
                </button>
            {/if}
        </panel>
    </drawer>
{/if}

<style type="text/scss">
    overlay,
    panel {
        height: calc(100% - 3rem);
    }

    panel {
        @apply fixed;
        @apply flex flex-col flex-auto overflow-hidden;
        @apply py-7 px-5;
        transition: right 0.2s ease;

        &.vertical {
            width: 420px;
        }

        &.horizontal {
            height: 350px;
            width: 100%;
        }
    }
</style>
