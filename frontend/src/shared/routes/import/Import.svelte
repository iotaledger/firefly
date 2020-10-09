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
            <Text type="h1" classes="mb-5">{locale('views.import.title')}</Text>
            <Text type="p" secondary={true} classes="mb-8">{locale('views.import.body')}</Text>
            <Button icon="biometric" classes="w-full mb-5" secondary={true} onClick={() => console.log('foo')}>
                {locale('views.import.action_1')}
            </Button>
            <Button icon="pin" classes="w-full mb-8" secondary={true} onClick={() => goto('pin')}>
                {locale('views.import.action_2')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="import-desktop" />
        </div>
    </OnboardingLayout>
{/if}
