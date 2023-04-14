<script lang="ts">
    import { fade, fly } from 'svelte/transition'
    import { NetworkConfigRouter } from '@components'
    import {
        SideDrawerDirection,
        closeSideDrawer,
        sideDrawerState,
        SideDrawerType,
    } from '@desktop/auxilary/side-drawer'

    export let onClose: () => unknown = () => {}

    const DRAWER_ANIMATION_DURATION_MS = 200

    let direction, position, isVertical

    $: setDirection($sideDrawerState.direction)
    function setDirection(sideDrawerDirection: SideDrawerDirection): void {
        switch (sideDrawerDirection) {
            case SideDrawerDirection.Bottom:
                direction = { x: 0, y: 100 }
                position = 'bottom-0'
                isVertical = false
                break
            case SideDrawerDirection.Top:
                direction = { x: 0, y: -100 }
                position = 'top-0'
                isVertical = false
                break
            case SideDrawerDirection.Left:
                direction = { x: -100, y: 0 }
                position = 'left-0'
                isVertical = true
                break
            case SideDrawerDirection.Right:
                direction = { x: 100, y: 0 }
                position = 'right-0'
                isVertical = true
                break
        }
    }

    function onOverlayClick(): void {
        if (!$sideDrawerState.preventClose) {
            onClose && onClose()
            closeSideDrawer()
        }
    }
</script>

{#if $sideDrawerState.active}
    <drawer class="fixed top-0 left-0 w-screen h-screen z-30">
        <overlay
            in:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
            on:click={onOverlayClick}
            on:keydown={() => {}}
            class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
        />
        <panel
            in:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            out:fly|local={{ ...direction, duration: DRAWER_ANIMATION_DURATION_MS }}
            class="bg-white dark:bg-gray-800 {position} {isVertical ? 'vertical' : 'horizontal'}"
        >
            {#if $sideDrawerState.type === SideDrawerType.Network}
                <NetworkConfigRouter />
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
