<script context="module" lang="typescript">
    export type ProgressStep = {
        title: string
        ongoing?: boolean
        complete?: boolean
    }
</script>

<script lang="typescript">
    import { Icon } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'

    export let steps: ProgressStep[] = []
    export let classes = ''

    $: darkModeEnabled = $appSettings.darkMode
</script>

<style type="text/scss">
    .complete,
    .ongoing {
        @apply relative;
        @apply border-0;
        @apply text-white;
        @apply bg-blue-500;
    }
    .circle-container {
        &:not(.last) {
            &::after {
                content: '';
                @apply absolute;
                @apply left-1/2;
                @apply bg-gray-300;
                z-index: -1;
                @apply w-full;
                @apply h-0.5;
            }
            &.completed-section {
                &::after {
                    @apply bg-blue-500;
                }
            }
        }
        > div {
            @apply border-gray-300;
        }
        &.darkmode {
            > div {
                @apply border-gray-700;
            }
            &:not(.last) {
                &::after {
                    @apply bg-gray-700;
                }
                &.completed-section {
                    &::after {
                        @apply bg-blue-500;
                    }
                }
            }
        }
    }
</style>

<div class={`flex flex-row items-center ${classes}`}>
    {#each steps as { title, ongoing, complete }, index}
        <div class="relative flex flex-col items-center justify-around w-full">
            <div
                class={`circle-container z-0 flex items-center justify-center ${ongoing ? 'w-7 h-7' : 'w-6 h-6'}`}
                class:completed-section={complete}
                class:last={index === steps.length - 1}
                class:darkmode={darkModeEnabled}>
                <div
                    class={`relative w-full h-full rounded-full border-solid border-2 border-gray-300 text-gray-500 flex items-center justify-center ${complete || ongoing ? 'bg-blue-500 dark:bg-blue-500' : 'bg-white dark:bg-gray-900'}`}
                    class:complete
                    class:ongoing>
                    <div
                        class="w-full h-full z-10 absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
                        {#if complete}
                            <Icon width="20" height="20" icon="success-check" classes="text-white" />
                        {:else}
                            <div
                                class={`text-center text-12 leading-120 ${ongoing ? 'text-white' : 'text-gray-500'} dark:text-white`}>
                                {index + 1}
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
            <div
                class={`text-center text-10 leading-120 ${ongoing ? 'mt-2 text-gray-800' : 'mt-2.5 text-gray-500'} dark:text-white`}>
                {title}
            </div>
        </div>
    {/each}
</div>
