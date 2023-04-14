<script lang="ts">
    import { fade, fly } from 'svelte/transition'
    import { Icon, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import { NetworkConfigDrawerRouter } from '@components'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon/enums'
    import { closeDrawer, DrawerDirection, DrawerId, drawerState } from '@desktop/auxilary/drawer'

    export let onClose: () => unknown = () => {}

    const DRAWER_ANIMATION_DURATION_MS = 200

    let drawerRoute: unknown
    let drawerRouter: Router<unknown>
    $: showBackButton = drawerRoute && drawerRouter?.hasHistory()

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

    function onBackClick(): void {
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

{#if $drawerState.active}
    <drawer class="fixed top-0 left-0 w-screen h-screen z-30">
        <overlay
            in:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            on:click={onCloseClick}
            on:keydown={() => {}}
            class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
        />
        <panel
            in:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            class="bg-white dark:bg-gray-800 {position} {isVertical ? 'vertical' : 'horizontal'}"
        >
            <div class="flex flex-row items-center mb-12">
                {#if showBackButton}
                    <button on:click={onBackClick} class="absolute top-6.5 focus:text-blue-500">
                        <Icon
                            icon={IconEnum.ArrowLeft}
                            classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                        />
                    </button>
                {/if}

                <Text type={TextType.h4} classes="text-center {showBackButton ? 'ml-9' : ''}">
                    {localize(`views.dashboard.drawers.${$drawerState?.id}.${drawerRoute}.title`)}
                </Text>

                {#if !$drawerState.hideClose}
                    <button on:click={onCloseClick} class="absolute top-7 right-7 focus:text-blue-500">
                        <Icon
                            icon={IconEnum.Close}
                            classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
                        />
                    </button>
                {/if}
            </div>

            {#if $drawerState.id === DrawerId.NetworkConfig}
                <NetworkConfigDrawerRouter bind:drawerRoute bind:drawerRouter />
            {/if}
        </panel>
    </drawer>
{/if}

<style type="text/scss">
    panel {
        @apply fixed;
        @apply flex flex-col flex-auto overflow-hidden;
        @apply pt-7 px-5;
        transition: right 0.2s ease;

        &.vertical {
            width: 420px;
            height: 100vw;
        }

        &.horizontal {
            height: 350px;
            width: 100vw;
        }
    }
</style>
