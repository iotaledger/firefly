<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Pin, Text } from 'shared/components'
    import { validatePinFormat } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let mobile
    export let pinCandidate
    export let busy = false

    let pinInput
    let error = ''

    const dispatch = createEventDispatcher()

    $: pinInput, (error = '')

    function onSubmit() {
        error = ''
        if (validatePinFormat(pinInput)) {
            if (pinInput !== pinCandidate) {
                error = locale('error.pincode.match')
            } else {
                dispatch('next')
            }
        }
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.confirmPin.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.confirmPin.body1')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.confirmPin.body2')}</Text>
            <Pin
                bind:value={pinInput}
                glimpse
                classes="w-full mx-auto block"
                on:submit={onSubmit}
                autofocus
                disabled={busy}
                {error} />
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={!validatePinFormat(pinInput) || busy} onClick={() => onSubmit()}>
                {locale('actions.confirmPin')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-pink dark:bg-gray-900">
            <Animation animation="repeat-pin-desktop" />
        </div>
    </OnboardingLayout>
{/if}
