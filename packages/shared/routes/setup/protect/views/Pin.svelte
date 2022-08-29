<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Pin, Text } from 'shared/components'
    import { mobile, isKeyboardOpened, keyboardHeight, getKeyboardTransitionSpeed } from 'shared/lib/app'
    import { validatePinFormat } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale
    export let busy = false

    let pinInput = ''
    let error = ''

    const dispatch = createEventDispatcher()

    $: pinInput, (error = '')

    function onSubmit(): void {
        error = ''
        if (validatePinFormat(pinInput)) {
            dispatch('next', { pin: pinInput })
        }
    }
    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.pin.title')}</Text>
    </div>
    <div
        slot="leftpane__content"
        class={$mobile && 'overflow-hidden'}
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Text type="p" secondary classes="mb-4">{locale('views.pin.body1')}</Text>
        <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.pin.body2')}</Text>
        <Pin
            bind:value={pinInput}
            glimpse
            classes="w-full mx-auto block mb-5"
            on:submit={onSubmit}
            autofocus
            disabled={busy}
            {error}
        />
    </div>
    <div
        slot="leftpane__action"
        class="flex flex-row flex-wrap justify-between items-center space-x-4"
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight
            : 0}px; transition: padding-bottom {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Button classes="flex-1" disabled={!validatePinFormat(pinInput) || busy} onClick={() => onSubmit()}>
            {locale('actions.setPin')}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-pink dark:bg-gray-900'}"
        style="margin-top: {$mobile && $isKeyboardOpened
            ? -$keyboardHeight
            : 0}px; transition: margin-top {getKeyboardTransitionSpeed($isKeyboardOpened) +
            'ms'} var(--transition-scroll)"
    >
        <Animation classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}" animation="pin-desktop" />
    </div>
</OnboardingLayout>
