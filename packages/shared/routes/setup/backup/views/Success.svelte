<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase, Text, Button, Icon } from 'shared/components'
    export let locale
    export let mobile
    export let mnemonic

    const dispatch = createEventDispatcher()
    let hide = true
    let hasRevealedRecoveryPhrase = false

    $: visibilityToggleString = hide ? 'revealRecoveryPhrase' : 'hideRecoveryPhrase'

    function handleContinueClick() {
        dispatch('next')
    }
    function handleBackClick() {
        dispatch('previous')
    }
    function handleMnemonicVisibilityClick() {
        hide = !hide
        hasRevealedRecoveryPhrase = true
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.recoveryPhraseSaved.title')}</Text>
            <div class="flex flex-row items-center">
                <Icon icon="checkmark" classes="checkmark mr-2 text-blue-500" />
                <Text type="p" secondary>{locale('views.recoveryPhraseSaved.body')}</Text>
            </div>
        </div>
        <div slot="leftpane__action">
            <Button disabled={!hasRevealedRecoveryPhrase} classes="w-full" onClick={() => handleContinueClick()}>
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex flex-row flex-wrap items-center justify-center p-16">
            <RecoveryPhrase classes="mb-8" recoveryPhrase={mnemonic} {hide} />
            <Button onClick={handleMnemonicVisibilityClick}>{locale(`views.recoveryPhrase.${visibilityToggleString}`)}</Button>
        </div>
    </OnboardingLayout>
{/if}
