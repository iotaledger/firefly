<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase, Text, Button } from 'shared/components'

    export let locale
    export let mobile
    export let mnemonic

    let recoveryPhraseInput

    // TODO: allow duplicated values in the recovery phrase validation
    $: valid = recoveryPhraseInput && mnemonic && mnemonic.length === recoveryPhraseInput.length

    const dispatch = createEventDispatcher()

    function handleContinue() {
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
            <Text type="h2" classes="mb-5">{locale('views.verify_recovery_phrase.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.verify_recovery_phrase.body')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={!valid} onClick={() => handleContinue()}>
                {locale('actions.verify_recovery_phrase')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16">
            <RecoveryPhrase recoveryPhrase={mnemonic} bind:recoveryPhraseInput shuffle />
        </div>
    </OnboardingLayout>
{/if}
