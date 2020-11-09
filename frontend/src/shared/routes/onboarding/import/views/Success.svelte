<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Text, Button, Icon } from '@shared-components'

    export let locale
    export let mobile
    export let importType

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
            <Text type="h1" classes="mb-5">{locale('views.import_success.title')}</Text>
            <div class="flex flex-row items-center">
                <Icon icon="checkmark" classes="checkmark mr-2" />
                <Text type="p" secondary>{locale(`views.import_success.body_${importType === 'mnemonic' ? '1' : '2'}`)}</Text>
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-end items-center">
            <Button onClick={() => handleContinueClick()}>{locale('actions.continue')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16" />
    </OnboardingLayout>
{/if}
