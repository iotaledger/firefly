<script lang="typescript">
    import { Animation, Button, ImportTextfield, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { Platform } from 'shared/lib/platform'
    import { createEventDispatcher, getContext, onMount, onDestroy } from 'svelte'
    import { Locale } from '@core/i18n'
    import { ImportRouter } from '@core/router'

    export let locale: Locale

    const dispatch = createEventDispatcher()
    const { importType, isGettingMigrationData } = getContext<ImportRouter>('importRouter')

    let input = ''
    let textFieldContainter: HTMLElement

    $: if ($mobile && input?.length > 0) {
        setTimeout(() => {
            textFieldContainter?.parentElement?.parentElement?.scrollTo(
                0,
                textFieldContainter?.parentElement?.parentElement?.scrollHeight
            )
        }, getKeyboardTransitionSpeed($isKeyboardOpened))
    }

    function handleContinueClick(): void {
        dispatch('next', { migrationSeed: input })
    }

    function handleBackClick(): void {
        if (!$isGettingMigrationData) {
            dispatch('previous')
        }
    }

    onMount(() => {
        Platform.enablePrivacy()
    })

    onDestroy(() => {
        Platform.disablePrivacy()
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale(`views.importFromText.${$importType}.title`)}</Text>
    </div>
    <div
        slot="leftpane__content"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Text type="p" secondary classes="mb-8">{locale(`views.importFromText.${$importType}.body`)}</Text>
        <Text type="h5" classes="mb-3">{locale(`views.importFromText.${$importType}.enter`)}</Text>
        <div bind:this={textFieldContainter}>
            <ImportTextfield disabled={$isGettingMigrationData} type={$importType} bind:value={input} {locale} />
        </div>
    </div>
    <div
        slot="leftpane__action"
        class="flex flex-row flex-wrap justify-between items-center space-x-4"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Button
            classes="flex-1"
            disabled={input.length === 0 || $isGettingMigrationData}
            onClick={() => handleContinueClick()}
        >
            {#if $isGettingMigrationData}
                <Spinner
                    busy={$isGettingMigrationData}
                    message={locale('views.migrate.restoringWallet')}
                    classes="justify-center"
                />
            {:else}{locale('actions.continue')}{/if}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-blue dark:bg-gray-900'}"
        style="margin-top: {$mobile && $isKeyboardOpened
            ? -$keyboardHeight
            : 0}px; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="import-from-text-desktop"
        />
    </div>
</OnboardingLayout>
