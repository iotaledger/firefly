<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase, Text, Button } from '@shared-components'

    export let locale
    export let mobile
    export let mnemonic

    const dispatch = createEventDispatcher()

    function handleContinueClick(options) {
        dispatch('next', { options })
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
            <Text type="h1" classes="mb-5">{locale('views.recovery-phrase.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.recovery-phrase.body_1')}</Text>
            <Text type="p" secondary highlighted classes="font-bold">{locale('views.recovery-phrase.body_2')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-row justify-between items-center">
            <Button ghost onClick={() => handleContinueClick('backup')}>{locale('actions.save_backup_file')}</Button>
            <Button onClick={() => handleContinueClick('verify')}>{locale('actions.ive_written_recovery_phrase')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex items-center justify-center p-16">
            {#if mnemonic !== undefined && mnemonic !== null}
                <RecoveryPhrase recoveryPhrase={mnemonic} />
            {/if}
        </div>
    </OnboardingLayout>
{/if}
