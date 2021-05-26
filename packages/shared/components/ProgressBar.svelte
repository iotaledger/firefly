<script lang="typescript">
    import { Spinner } from 'shared/components'
    export let percent = 0
    export let classes = ''
    export let message = ''
    export let secondary = false
    export let narrow = false
    export let preloading = false
</script>

<style type="text/scss">
    .progress-wrapper {
        div,
        .progress {
            @apply h-12;
        }
        .progress {
            transition: width 0.25s;
        }
        .message {
            z-index: 1;
            @apply absolute;
        }
        &.narrow {
            @apply pb-8;
            div,
            .progress {
                @apply h-4;
            }
            .message {
                @apply bottom-0;
            }
        }
    }
</style>

<div class="relative progress-wrapper flex flex-col justify-center items-center w-full" class:narrow>
    <div
        class="relative w-full flex justify-center items-center overflow-hidden  {secondary ? 'border border-solid border-gray-300' : 'bg-blue-500'} rounded-2xl {classes}">
        <span
            class="absolute left-0 inline-block {secondary ? 'bg-blue-200' : 'bg-yellow-500'} progress rounded-2xl"
            style={`width:${Math.max(Math.min(percent, 100), 0)}%`} />
    </div>
    <span
        class="font-bold text-12 {narrow ? 'text-gray-800 dark:text-white' : secondary ? 'text-blue-500' : 'text-white'} message">
        {#if preloading}
            <Spinner
                busy={preloading}
                classes={narrow ? 'text-gray-800 dark:text-white' : secondary ? 'text-blue-500' : 'text-white'} />
        {:else}{message}{/if}
    </span>
</div>
