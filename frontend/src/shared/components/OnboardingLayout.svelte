<script>
    import { Logo, Icon } from '@shared-components'
    export let allowBack = true
    export let onBackClick = () => {}
</script>

<style type="text/scss">
    :global(.back svg) {
        @apply cursor-pointer;
    }
    :global(.back svg path) {
        fill: var(--ui-blue-color); // TODO: tailwindify
    }
</style>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
<div data-label="onboarding-layout" class="w-full h-full flex flex-row">
    <div data-label="leftpane" style="width: 430px;" class="flex flex-col flex-shrink-0 justify-between pt-12 pb-16 px-12">
        <div class="flex flex-col">
            <div class="w-full mb-10">
                {#if allowBack}
                    <div class="back" on:click={onBackClick}>
                        <Icon icon="arrow-left" />
                    </div>
                {:else}
                    <Logo width="64px" logo="logo-firefly" />
                {/if}
            </div>
            <div data-label="leftpane-content">
                <slot name="leftpane__content" />
            </div>
        </div>
        <div data-label="leftpane-action">
            <slot name="leftpane__action" />
        </div>
    </div>
    <div data-label="rightpane" style="background-color: var(--element-bg-color);" class="w-full">
        <slot name="rightpane" />
    </div>
</div>
