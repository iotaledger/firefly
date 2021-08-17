<script lang="typescript">
    import { Button, Icon, OnboardingLayout, RecoveryPhrase, Text } from 'shared/components'
    import { downloadRecoveryKit } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile
    export let mnemonic
    export let busy

    const dispatch = createEventDispatcher()
    let hide = true
    let hasRevealedRecoveryPhrase = false

    function handleContinueClick(options) {
        dispatch('next', { options })
    }
    function handleBackClick() {
        dispatch('previous')
    }
    function handleMnemonicVisibilityClick() {
        hide = !hide
        hasRevealedRecoveryPhrase = true
    }
    function handleDownloadClick() {
        downloadRecoveryKit()
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.recoveryPhrase.title')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.recoveryPhrase.body1')}</Text>
            <Text type="p" secondary highlighted classes="font-bold mb-4">{locale('views.recoveryPhrase.body2')}</Text>
            <Text type="p" secondary classes="mb-4">{locale('views.recoveryPhrase.body3')}</Text>
        </div>
        <div slot="leftpane__action" class="flex flex-col">
            <Button secondary classes="flex-1 mb-4" onClick={() => handleDownloadClick()}>
                {locale('actions.downloadRecoveryKit')}
            </Button>
            <Button
                disabled={!hasRevealedRecoveryPhrase}
                classes="flex-1"
                onClick={() => handleContinueClick('verify')}
            >
                {locale('actions.continue')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex flex-col items-center justify-center p-4">
            {#if mnemonic !== undefined && mnemonic !== null}
                <RecoveryPhrase classes="mb-8" recoveryPhrase={mnemonic} {hide} />
                {#if !hasRevealedRecoveryPhrase}
                    {#if hide}
                        <Button onClick={handleMnemonicVisibilityClick} classes="absolute">
                            {locale('views.recoveryPhrase.revealRecoveryPhrase')}
                        </Button>
                    {/if}
                {:else}
                    <button
                        on:click={handleMnemonicVisibilityClick}
                        class="absolute top-10 right-10 flex flex-row items-center"
                        type="button"
                    >
                        <Text smaller overrideColor classes="text-blue-500 mr-2">
                            {locale(`views.recoveryPhrase.${hide ? 'revealRecoveryPhrase' : 'hideRecoveryPhrase'}`)}
                        </Text>
                        <Icon icon={hide ? 'view' : 'hide'} classes="text-blue-500" />
                    </button>
                {/if}
            {/if}
        </div>
    </OnboardingLayout>
{/if}
