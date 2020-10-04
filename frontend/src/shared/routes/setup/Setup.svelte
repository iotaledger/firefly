<script>
    import { OnboardingLayout, Logo, Box, Illustration, Text, Button, Link } from '@shared-components'
    export let locale
    export let mobile
    export let goto
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1">{locale('views.setup.title')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button ghost={true} onClick={() => goto('legal')}>{locale('actions.import_wallet')}</Button>
            <Button onClick={() => goto('setup-password')}>{locale('actions.create_wallet')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16 bg-white">
            <Illustration width="100%" illustration="setup" />
        </div>
    </OnboardingLayout>
{/if}
