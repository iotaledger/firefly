<script lang="ts">
    import { fade, fly } from 'svelte/transition'
    import { appSettings } from '@core/app'

    export let onClose: () => unknown = () => {}
    export let preventClose: boolean = false

    const DRAWER_ANIMATION_DURATION_MS = 200
    const directon = { x: 100 }

    const position = 0

    function onOverlayClick(): void {
        if (!preventClose) {
            onClose && onClose()
        }
    }
</script>

<drawer class="fixed top-0 left-0 w-screen h-screen">
    <overlay
        in:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
        out:fade|local={{ duration: DRAWER_ANIMATION_DURATION_MS }}
        on:click={onOverlayClick}
        on:keydown={() => {}}
        class="fixed top-0 left-0 w-full h-full z-0 bg-gray-700 dark:bg-gray-900 bg-opacity-60 dark:bg-opacity-60"
    />
    <panel
        in:fly|local={{ ...directon, duration: DRAWER_ANIMATION_DURATION_MS }}
        out:fly|local={{ ...directon, duration: DRAWER_ANIMATION_DURATION_MS }}
        class="h-screen"
        class:darkmode={$appSettings.darkMode}
        style:--right={`${position}px`}
    >
        <slot />
    </panel>
</drawer>

<style type="text/scss">
    panel {
        @apply fixed w-full max-h-full;
        @apply flex flex-col flex-auto overflow-hidden;
        @apply pt-7 px-5;
        @apply bg-white;
        width: 420px;
        transition: bottom 0.2s ease;
        right: var(--right);

        &.darkmode {
            @apply bg-gray-800;
        }
    }
</style>
