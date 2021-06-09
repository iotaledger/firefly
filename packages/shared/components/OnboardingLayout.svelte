<script lang="typescript">
    import { Icon, ProgressFlow } from 'shared/components'

    export let allowBack = true
    export let onBackClick = () => {}
    export let busy = false
    export let steps = undefined
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
<div data-label="onboarding-layout" class="relative w-full h-full flex flex-row">
    <div data-label="leftpane" class="h-full flex justify-center p-10 bg-white dark:bg-gray-800" style={`width: 38%;`}>
        <div class="w-full h-full flex flex-col justify-between" style="max-width: 406px;">
            <div class="flex flex-col h-full">
                {#if allowBack}
                    <button on:click={onBackClick} class="mb-8 w-6 h-6" disabled={busy}>
                        <Icon
                            icon="arrow-left"
                            classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'} />
                    </button>
                {/if}
                <div data-label="leftpane-content" class="h-full">
                    <slot name="leftpane__content" />
                </div>
            </div>
            <div data-label="leftpane-action" class="mt-6">
                <slot name="leftpane__action" />
            </div>
        </div>
    </div>
    <div data-label="rightpane" style={`width: 62%;`} class="relative bg-gray-100 dark:bg-gray-900">
        <slot name="rightpane" />
        {#if steps}
            <div class="absolute transform bottom-8 left-1/2 -translate-x-1/2 w-full px-20">
                <ProgressFlow {steps} />
            </div>
        {/if}
    </div>
</div>
