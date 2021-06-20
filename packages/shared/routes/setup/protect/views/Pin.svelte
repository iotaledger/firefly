<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Pin, Text } from 'shared/components'
    import { validatePinFormat } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile
    export let busy = false

    let pinInput
    let error = ''

    const dispatch = createEventDispatcher()

    $: pinInput, (error = '')

    function onSubmit() {
        error = ''
        if (validatePinFormat(pinInput)) {
            dispatch('next', { pinCandidate: pinInput })
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy} {mobile}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{locale('views.pin.title')}</Text>
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
            {mobile} />
    </div>
    <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
        <Button classes="flex-1" disabled={!validatePinFormat(pinInput) || busy} onClick={() => onSubmit()}>
            {locale('actions.setPin')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-pink dark:bg-gray-900">
        <Animation animation="pin-desktop" />
    </div>
</OnboardingLayout>
