<script>
    import { OnboardingLayout, Password, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile
    export let goto
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout allowBack={false}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.setup_password.title')}</Text>
            <Text type="p" secondary={true}>{locale('views.setup_password.body')}</Text>
            <Password {locale} showRevealToggle={true} showStrengthLevel={true} />
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => goto('legal')}>{locale('actions.save_password')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16 bg-white">
            <Illustration width="100%" illustration="setup" />
        </div>
    </OnboardingLayout>
{/if}
