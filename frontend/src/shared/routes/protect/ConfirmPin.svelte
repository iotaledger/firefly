<script>
    import { OnboardingLayout, Illustration, Text, Button, Pin } from '@shared-components'
    export let locale
    export let mobile
    export let goto

    let pin
    let valid = false

    $: valid = Number.isInteger(pin) && `${pin}`.length === 6
</script>

<style type="text/scss">
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.confirm_pin.title')}</Text>
            <Text type="p" secondary classes="mb-8">{locale('views.confirm_pin.body')}</Text>
            <Pin bind:value={pin} classes="w-full mx-auto block mt-24" />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => goto('backup')}>{locale('actions.set_pin')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="repeat-pin-desktop" />
        </div>
    </OnboardingLayout>
{/if}
