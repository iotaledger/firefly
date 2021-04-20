<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile
    export let busy

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
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.backup.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.backup.body1')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.backup.body2')}</Text>
            <Text type="p" secondary highlighted classes="mb-4 font-bold">{locale('views.backup.body3')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => handleContinueClick()} autofocus>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
            <Animation animation="backup-desktop" />
        </div>
    </OnboardingLayout>
{/if}
