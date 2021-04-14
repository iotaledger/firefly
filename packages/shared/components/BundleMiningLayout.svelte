<script lang="typescript">
    import { Box, Icon } from 'shared/components'

    export let onBackClick = () => {}

    export let allowBack = true
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}

{#if allowBack}
    <div data-label="back-button" class="absolute top-12 left-5" on:click={onBackClick}>
        <Icon icon="arrow-left" classes="cursor-pointer text-blue-500" />
    </div>
{/if}
<div data-label="bundle-mining-layout" class="flex flex-col w-full h-screen justify-center items-center">
    <div class="w-2/5 h-auto">
        <Box classes="bg-gray-50 dark:bg-gray-800 dark:bg-opacity-50 rounded-lg py-10 px-20">
            <div class="flex justify-center -mt-16">
                <slot name="icon_boxed" />
            </div>
            <div class="mt-6">
                <slot name="box_content" />
            </div>
        </Box>
    </div>
    <slot name="actions" />
</div>
