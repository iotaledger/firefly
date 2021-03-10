<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase, Text, Button, Spinner } from 'shared/components'

    export let locale
    export let mobile
    export let mnemonic
    export let creatingAccount

    let recoveryPhraseInput
    let valid = false

    $: {
        valid =
            recoveryPhraseInput &&
            mnemonic &&
            mnemonic.length === recoveryPhraseInput.length &&
            mnemonic.join('') === recoveryPhraseInput.join('')
    }

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
            <Button classes="w-full" disabled={!valid || creatingAccount} onClick={() => handleContinue()}>
                {#if creatingAccount}
                    <Spinner busy={creatingAccount} message={locale('views.verify_recovery_phrase.creating_account')} classes="justify-center" />
                {:else}
                    {locale('actions.verify_recovery_phrase')}
                {/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex flex-row flex-wrap items-center justify-center p-16">
            <RecoveryPhrase recoveryPhrase={mnemonic} bind:recoveryPhraseInput isVerification disabled={creatingAccount} />
            <Button onClick={() => (recoveryPhraseInput = [])} disabled={creatingAccount}>
                {locale('views.verify_recovery_phrase.reset_recovery_verification')}
            </Button>
        </div>
    </OnboardingLayout>
{/if}
