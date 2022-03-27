<script lang="typescript">
    import { Icon, ProgressFlow, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { ledgerMigrationProgresses, LEDGER_MIGRATION_VIDEO } from 'shared/lib/migration'
    import { openPopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'
    import { tick } from 'svelte';
    import * as eases from 'svelte/easing';
	import { fade } from 'svelte/transition';

    export let locale: Locale

    export let allowBack = true
    export let busy = false
    export let showLedgerProgress = false
    export let showLedgerVideoButton = false
    export let reverseContent = false

    export let onBackClick = (): void => {}

    async function onBackClickWapper() {
        await tick()
        onBackClick()
    }

    let mobileTopContentHeight,
        leftpaneContentHeight = 0

    function handleWatchVideoClick() {
        openPopup({
            type: 'video',
            props: { video: LEDGER_MIGRATION_VIDEO, title: locale('views.setupLedger.videoGuide') },
        })
    }
</script>

<!-- https://github.com/sveltejs/svelte/issues/4546 -->
{#if false}
    <slot />
{/if}
<!--  -->
{#if $mobile}
    <div class="grid ff h-screen px-5">
        <header class="row-start-1 grid justify-center items-start py-3">
            {#if allowBack}
                <button on:click={onBackClickWapper} class="" disabled={busy}>
                    <Icon
                        icon="arrow-left"
                        classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'}
                    />
                </button>
            {/if}
            <slot name="title" />
        </header>
        <!-- use this on NO input select android, only needed to scroll legals -->
        <section 
            class="top py-3 {reverseContent ? 'overflow-y-auto row-span-3' : ''}"
            style="grid-row: {reverseContent ? 'span 3' : ''}"
            in:fade={{ duration: reverseContent ? 0 : 600}}
        > 
            <slot name="rightpane" />
        </section>
        <section class="bottom">
            <slot name="leftpane__content" />
        </section>
        <footer class="py-3">
            <slot name="leftpane__action" />
        </footer>
    </div>
{:else}
    <div data-label="onboarding-layout" class="relative w-full h-full flex flex-row">
        <div
            data-label="leftpane"
            class="h-full flex justify-center p-10 bg-white dark:bg-gray-800"
            style="width: 38%;"
        >
            <div class="w-full h-full flex flex-col justify-between" style="max-width: 406px;">
                <div class="flex flex-col h-full">
                    {#if allowBack}
                        <button
                            on:click={onBackClick}
                            class="mb-8 w-6 h-6 {busy && 'pointer-events-none opacity-50'}"
                            disabled={busy}
                        >
                            <Icon
                                icon="arrow-left"
                                classes={busy ? 'pointer-events-none text-gray-500' : 'cursor-pointer text-blue-500'}
                            />
                        </button>
                    {/if}
                    <div data-label="leftpane-content" class="h-full">
                        <div class="mb-5">
                            <slot name="title" />
                        </div>
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
            {#if showLedgerProgress}
                <div class="absolute transform bottom-8 left-1/2 -translate-x-1/2 w-full px-20">
                    <ProgressFlow progress={$ledgerMigrationProgresses} />
                </div>
            {/if}
            {#if showLedgerVideoButton}
                <button
                    on:click={handleWatchVideoClick}
                    class="absolute top-6 right-6 px-8 py-2.5 text-blue-500 bg-transparent flex flex-row items-center justify-center border border-solid border-gray-300 dark:border-gray-700 rounded-xl"
                >
                    <Icon icon="play" classes="text-blue-500 mr-2" />
                    <Text smaller overrideColor classes="text-blue-500">{locale('views.setupLedger.watchVideo')}</Text>
                </button>
            {/if}
        </div>
    </div>
{/if}

<style type="text/scss">
    .ff {
        grid-template-rows: auto auto 1fr 1fr;
        overflow-y: auto;
    }

    .top {
        grid-row: span 2;
    }
    .bottom {
        grid-row: span 1;
    }
    header {
        grid-template-columns: auto 1fr;
        margin-top: env(safe-area-inset-top);
        :global(h2) {
            @apply text-center;
            @apply font-sans;
            @apply text-16;
            @apply leading-140;
        }
    }
    footer {
        // grid-row: span 3;
        margin-bottom: env(safe-area-inset-bottom);
    }
</style>
