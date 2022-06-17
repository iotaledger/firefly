<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, OnboardingLayout, Pin, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { walletPin } from '@contexts/onboarding'
    import { Locale } from '@core/i18n'
    import { validatePinFormat } from '@lib/utils'
    import { resetImportState } from '@contexts/onboarding'

    export let locale: Locale
    export let busy = false

    let pinInput = ''
    let error = ''

    const dispatch = createEventDispatcher()

    $: pinInput, (error = '')

    function onSubmit(): void {
        error = ''
        if (validatePinFormat(pinInput)) {
            $walletPin = pinInput
            dispatch('next')
        }
    }
    async function handleBackClick(): Promise<void> {
        await resetImportState()
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy}>
    <div slot="title">
        <Text type="h2">{locale('views.pin.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.pin.body1')}</Text>
        <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.pin.body2')}</Text>
        <Pin
            bind:value={pinInput}
            glimpse
            classes="w-full mx-auto block"
            on:submit={onSubmit}
            autofocus
            disabled={busy}
            {error}
        />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={!validatePinFormat(pinInput) || busy} onClick={() => onSubmit()}>
            {locale('actions.setPin')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-pink dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="pin-desktop" />
    </div>
</OnboardingLayout>
