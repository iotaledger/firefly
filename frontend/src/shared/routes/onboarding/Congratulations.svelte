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
            <Text type="h1" classes="mb-5">{locale('views.congratulations.title')}</Text>
            <Text type="p" secondary={true} classes="mb-4">{locale('views.congratulations.body')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => goto('onboarding-1')}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="congratulations-desktop" />
        </div>
    </OnboardingLayout>
{/if}
