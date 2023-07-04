<script lang="ts" context="module">
    export enum ToggleColor {
        Green = 'green',
        Blue = 'blue',
    }
</script>

<script lang="ts">
    export let active: boolean = false
    export let color: ToggleColor = ToggleColor.Blue
    export let disabled: boolean = false

    export let onClick: (() => unknown) | undefined = undefined

    function onToggleClick(): void {
        if (!disabled && onClick) {
            onClick()
        }
    }
</script>

<button on:click={onToggleClick} {disabled} type="button" class:active class={active ? `toggle-${color}` : null}>
    <knob />
</button>

<style lang="scss">
    button {
        @apply relative;
        @apply block;
        @apply w-10;
        @apply shrink-0;
        @apply h-6;
        @apply rounded-full;
        @apply border border-solid border-transparent dark:border-gray-700;
        @apply bg-gray-200 dark:bg-gray-900;

        &[disabled] {
            @apply opacity-40;
        }

        &.active {
            &.toggle-green {
                @apply bg-green-500;
            }
            &.toggle-blue {
                @apply bg-blue-500;
            }
            knob {
                @apply left-5;
            }
        }

        knob {
            @apply absolute;
            @apply rounded-full;
            @apply h-4 w-4;
            @apply top-1/2 left-1;
            @apply transform -translate-y-1/2;
            @apply bg-white dark:bg-gray-800;
            transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
</style>
