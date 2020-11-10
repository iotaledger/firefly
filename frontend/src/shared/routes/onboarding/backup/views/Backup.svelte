<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from '@shared-components'
    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
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
            <Text type="h1" classes="mb-5">{locale('views.backup.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.backup.body_1')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.backup.body_2')}</Text>
            <Text type="p" secondary highlighted classes="mb-8 font-bold">{locale('views.backup.body_3')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex p-16">
            <Illustration width="100%" illustration="backup-desktop" />
        </div>
    </OnboardingLayout>
{/if}
