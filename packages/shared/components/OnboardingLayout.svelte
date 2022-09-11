<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Icon, Text } from 'shared/components'
    import { mobile } from '@core/app'

    export let allowBack = true
    export let busy = false
    export let reverseContent = false

    export let onBackClick = (): void => {}

    // TODO: Separate mobile
    let mobileTopContentHeight,
        leftpaneContentHeight = 0
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
{#if $mobile}
    <div data-label="mobile-onboarding-layout" class="relative h-full px-5 flex flex-col justify-between">
        <header class="relative w-full flex justify-center px-8 py-3">
            <Text type="h4" classes="text-center">
                <slot name="title" />
            </Text>
            {#if allowBack}
                <button on:click={onBackClick} class="absolute top-3 left-0" disabled={busy}>
                    <Icon
                        icon="arrow-left"
                        classes={busy ? 'pointer-events-handlers-none text-gray-500' : 'cursor-pointer text-blue-500'}
                    />
                </button>
            {/if}
        </header>
        <!-- TODO: fix flex-col-reverse scrolls mobile-top-content to bottom -->
        <div
            bind:clientHeight={mobileTopContentHeight}
            data-label="mobile-top-content"
            class="flex {reverseContent ? 'flex-col-reverse' : 'flex-col'} overflow-y-auto flex-auto h-1 pt-5"
        >
            <div style={$mobile && `max-height: ${mobileTopContentHeight - leftpaneContentHeight - 20}px;`}>
                <slot name="rightpane" />
            </div>
            <div bind:clientHeight={leftpaneContentHeight}>
                <slot name="leftpane__content" />
            </div>
        </div>
        <footer class="py-3">
            <slot name="leftpane__action" />
        </footer>
    </div>
{:else}
    <div data-label="onboarding-layout" class="relative w-full h-full flex flex-row">
        <div
            data-label="leftpane"
            class="h-full flex justify-center p-12 pt-8 bg-white dark:bg-gray-800"
            style="width: 38%;"
        >
            <div class="w-full h-full flex flex-col justify-between" style="max-width: 406px;">
                <div class="flex flex-col h-full">
                    {#if allowBack}
                        <button
                            on:click={onBackClick}
                            class="mb-8 w-6 h-6 {busy && 'pointer-events-none opacity-50'} highlight"
                            disabled={busy}
                            aria-label={localize('actions.back')}
                        >
                            <Icon
                                icon="arrow-left"
                                classes={busy
                                    ? 'pointer-events-handlers-none text-gray-500'
                                    : 'cursor-pointer text-blue-500'}
                            />
                        </button>
                    {/if}
                    <div data-label="leftpane-content" class="h-full flex flex-col">
                        {#if $$slots.title}
                            <div class="mb-5">
                                <slot name="title" />
                            </div>
                        {/if}
                        <slot name="leftpane__content" />
                    </div>
                </div>
                <div data-label="leftpane-action" class="mt-6">
                    <slot name="leftpane__action" />
                </div>
            </div>
        </div>
        <div data-label="rightpane" style="width: 62%;" class="relative bg-gray-100 dark:bg-gray-900">
            <slot name="rightpane" />
        </div>
    </div>
{/if}

<style type="text/scss">
    header {
        margin-top: env(safe-area-inset-top);
        :global(h1),
        :global(h2),
        :global(h3),
        :global(h4),
        :global(h5) {
            @apply font-bold;
            @apply text-16;
            @apply leading-140;
        }
    }
    footer {
        margin-bottom: env(safe-area-inset-bottom);
    }
    .highlight {
        transition: filter 0.2s;

        &:focus {
            filter: brightness(1.3);
        }
    }
</style>
