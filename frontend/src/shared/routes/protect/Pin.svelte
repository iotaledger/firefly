<script>
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile
    export let goto

    let valid = false
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={true}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.pin.title')}</Text>
            <Text type="p" secondary={true} classes="mb-4">{locale('views.pin.body_1')}</Text>
            <Text type="p" secondary={true} classes="mb-8 font-bold">{locale('views.pin.body_2')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button disabled={!valid} onClick={() => goto('protect')}>{locale('actions.set_pin')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="pin-desktop" />
        </div>
    </OnboardingLayout>
{/if}
