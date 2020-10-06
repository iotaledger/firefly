<script>
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile
    export let goto
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={true}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.protect.title')}</Text>
            <Text type="p" secondary={true} classes="mb-4">{locale('views.protect.body_1')}</Text>
            <Text type="p" secondary={true} highlighted={true} classes="mb-8 font-bold">{locale('views.protect.body_2')}</Text>
            <Button icon="biometric" classes="w-full mb-5" secondary={true} onClick={() => console.log('foo')}>
                {locale('actions.use_biometric')}
            </Button>
            <Button icon="pin" classes="w-full mb-8" secondary={true} onClick={() => goto('pin')}>
                {locale('actions.setup_pin')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="protect-desktop" />
        </div>
    </OnboardingLayout>
{/if}
