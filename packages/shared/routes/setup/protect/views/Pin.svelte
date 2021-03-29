<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Pin, Text } from 'shared/components'
    import { validatePinFormat } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile
    export let pinCandidate
    export let busy = false

    let pinInput
    let error = ''

    const dispatch = createEventDispatcher()

    $: confirmInput = pinCandidate !== null
    $: pinInput, (error = '')

    function onSubmit() {
        error = ''
        if (validatePinFormat(pinInput)) {
            if (confirmInput && pinInput !== pinCandidate) {
                error = locale('error.pincode.match')
            } else {
                const pin = pinInput
                pinInput = ''
                dispatch('next', !confirmInput ? { pinCandidate: pin } : null)
            }
        }
    }
    function handleBackClick() {
        pinInput = ''
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            {#if !confirmInput}
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
                    {error} />
            {:else}
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
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={!validatePinFormat(pinInput) || busy} onClick={() => onSubmit()}>
                {locale(confirmInput ? 'actions.confirmPin' : 'actions.setPin')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-pink dark:bg-gray-900">
            <Illustration width="100%" height="auto" illustration={confirmInput ? 'repeat-pin-desktop' : 'pin-desktop'} />
        </div>
    </OnboardingLayout>
{/if}
