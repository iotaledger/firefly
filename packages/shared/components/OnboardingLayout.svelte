<script lang="typescript">
    import { Icon } from 'shared/components'

    export let allowBack = true
    export let onBackClick = () => {}
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
<div data-label="onboarding-layout" class="relative w-full h-full flex flex-row">
    <div data-label="leftpane" class="h-full flex justify-center p-10 bg-white dark:bg-gray-800" style={`width: 38%;`}>
        <div class="w-full h-full flex flex-col justify-between" style="max-width: 406px;">
            <div class="flex flex-col">
                {#if allowBack}
                    <button on:click={onBackClick} class="mb-8">
                        <Icon icon="arrow-left" classes="cursor-pointer text-blue-500" />
                    </button>
                {/if}
                <div data-label="leftpane-content">
                    <slot name="leftpane__content" />
                </div>
            </div>
            <div data-label="leftpane-action" class="mt-6">
                <slot name="leftpane__action" />
            </div>
        </div>
    </div>
    <div data-label="rightpane" style={`width: 62%;`} class="bg-gray-100 dark:bg-gray-900">
        <slot name="rightpane" />
    </div>
</div>
