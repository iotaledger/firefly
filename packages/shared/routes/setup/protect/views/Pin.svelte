<script lang="typescript">
    import { OnboardingLayout, Illustration, Text, Button, Pin } from 'shared/components'
    import { createEventDispatcher } from 'svelte'
    import { validatePinFormat } from 'shared/lib/utils'

    export let locale
    export let mobile
    export let pinCandidate

    export let loading

    let pinInput

    const dispatch = createEventDispatcher()

    $: confirmInput = pinCandidate !== null
    $: valid = !!pinCandidate
        ? validatePinFormat(pinInput) && pinInput === pinCandidate
        : validatePinFormat(pinInput)

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
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            {#if !confirmInput}
                <Text type="h2" classes="mb-5">{locale('views.pin.title')}</Text>
                <Text type="p" secondary classes="mb-4">{locale('views.pin.body_1')}</Text>
                <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.pin.body_2')}</Text>
                <Pin bind:value={pinInput} classes="w-full mx-auto block" on:submit={onSubmit} autofocus />
            {:else}
                <Text type="h2" classes="mb-5">{locale('views.confirm_pin.title')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.confirm_pin.body')}</Text>
                <Pin bind:value={pinInput} classes="w-full mx-auto block" on:submit={onSubmit} autofocus />
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-row flex-wrap justify-between items-center space-x-4">
            <Button secondary classes="flex-1" onClick={() => handleBackClick()}>{locale('actions.back')}</Button>
            <Button classes="flex-1" disabled={!valid || loading} onClick={() => onSubmit()}>{locale('actions.set_pin')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center">
            {#if !confirmInput}
                <Illustration width="100%" illustration="pin-desktop" />
            {:else}
                <Illustration width="100%" illustration="repeat-pin-desktop" />
            {/if}
        </div>
    </OnboardingLayout>
{/if}
