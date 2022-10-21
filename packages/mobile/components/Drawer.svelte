<script lang="typescript">
    import { fade, fly } from 'svelte/transition'
    export let onClose: () => unknown = () => {}
    export let fullScreen: boolean = false

    let panelBottom = 0
    let moving = false
    let panelHeight
    let touchStartY

    function onTouchStart(event): void {
        moving = true
        touchStartY = event.touches[0].pageY
    }

    function onTouchMove(event): void {
        if (moving && event.targetTouches.length === 1) {
            const touchY = event.touches[0].pageY
            panelBottom = Math.min(touchStartY - touchY, 0)
        }
    }

    function onTouchEnd(): void {
        moving = false
        if (panelBottom < -panelHeight / 3) {
            onClose()
        } else {
            panelBottom = 0
        }
    }
</script>

<svelte:window on:touchend={onTouchEnd} on:touchmove={onTouchMove} />
<drawer class="fixed top-0 z-30 w-screen h-screen z-40">
    <overlay
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 200 }}
        on:click={onClose}
        class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
    />
    <panel
        on:touchstart={onTouchStart}
        in:fly={{ y: 100, duration: 300 }}
        out:fly={{ y: 100, duration: 200 }}
        bind:clientHeight={panelHeight}
        class:moving
        class="py-6 px-5 fixed w-full flex flex-auto {fullScreen
            ? 'h-screen'
            : ''} justify-center z-10 bg-white dark:bg-gray-800 rounded-t-2xl"
        style="bottom: {panelBottom}px;"
    >
        <decorator class="absolute top-2 w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded" />
        <slot />
    </panel>
</drawer>

<style type="text/scss">
    panel {
        transition: bottom 0.2s ease;
        &.moving {
            transition: none;
        }
    }
</style>
