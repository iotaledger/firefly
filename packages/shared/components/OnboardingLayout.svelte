<script>
    import { Icon } from 'shared/components'
    export let allowBack = true
    export let onBackClick = () => {}
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
<div data-label="onboarding-layout" class="relative w-full h-full flex flex-row bg-white dark:bg-blue-900">
    {#if allowBack}
        <div data-label="back-button" class="absolute top-0 left-0 pl-5 pt-5" on:click={onBackClick}>
            <Icon icon="arrow-left" classes="cursor-pointer text-blue-500" />
        </div>
    {/if}
    <div data-label="leftpane" class="w-1/2 h-full flex justify-center px-10 pt-8 pb-16">
        <div style="max-width: 336px;" class="w-full h-full flex flex-col justify-center">
            <div class="flex flex-col">
                <div class="w-full mb-10" />
                <div data-label="leftpane-content">
                    <slot name="leftpane__content" />
                </div>
            </div>
            <div data-label="leftpane-action" class="mt-6">
                <slot name="leftpane__action" />
            </div>
        </div>
    </div>
    <div data-label="rightpane" class="w-1/2">
        <slot name="rightpane" />
    </div>
</div>
