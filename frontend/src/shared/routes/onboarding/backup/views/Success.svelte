<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase, Text, Button, Icon } from '@shared-components'

    export let locale
    export let mobile
    export let mnemonic

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
</script>

<style type="text/scss">
    :global(.checkmark path) {
        fill: var(--ui-blue-color);
    }
</style>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h1" classes="mb-5">{locale('views.recovery-phrase-saved.title')}</Text>
            <div class="flex flex-row items-center">
                <Icon icon="checkmark" classes="checkmark mr-2" />
                <Text type="p" secondary>{locale('views.recovery-phrase-saved.body')}</Text>
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16">
            <RecoveryPhrase recoveryPhrase={mnemonic} />
        </div>
    </OnboardingLayout>
{/if}
