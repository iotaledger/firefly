<script lang="typescript">
    import { OnboardingLayout, Illustration, Text, Button, Pin } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { validatePinFormat } from 'shared/lib/utils'

    export let locale
    export let mobile
    export let pinCandidate
    export let busy = false

    let pinInput

    const dispatch = createEventDispatcher()

    $: confirmInput = pinCandidate !== null
    $: valid = !!pinCandidate ? validatePinFormat(pinInput) && pinInput === pinCandidate : validatePinFormat(pinInput)

    function onSubmit() {
        if (valid) {
            dispatch('next', !confirmInput ? { pinCandidate: pinInput } : null)
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
            {#if !confirmInput}
                <Text type="h2" classes="mb-5">{locale('views.pin.title')}</Text>
                <Text type="p" secondary classes="mb-4">{locale('views.pin.body1')}</Text>
                <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.pin.body2')}</Text>
                <Pin bind:value={pinInput} glimpse classes="w-full mx-auto block" on:submit={onSubmit} autofocus disabled={busy} />
            {:else}
                <Text type="h2" classes="mb-5">{locale('views.confirmPin.title')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.confirmPin.body')}</Text>
                <Pin bind:value={pinInput} glimpse classes="w-full mx-auto block" on:submit={onSubmit} autofocus disabled={busy} />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button classes="flex-1" disabled={!valid || busy} onClick={() => onSubmit()}>{locale(confirmInput ? 'actions.confirmPin' : 'actions.setPin')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center p-16 bg-pastel-pink dark:bg-gray-900">
            <Illustration width="auto" height="auto" illustration={confirmInput ? 'repeat-pin-desktop' : 'pin-desktop'} />
        </div>
    </OnboardingLayout>
{/if}
