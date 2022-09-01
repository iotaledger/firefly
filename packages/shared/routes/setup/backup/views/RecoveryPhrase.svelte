<script lang="typescript">
    import { Button, Icon, OnboardingLayout, RecoveryPhrase, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { downloadRecoveryKit } from 'shared/lib/utils'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale
    export let mnemonic
    export let busy

    const dispatch = createEventDispatcher()
    let hide = true
    let hasRevealedRecoveryPhrase = false

    function handleContinueClick(skipVerify: boolean) {
        dispatch('next', { skip: skipVerify })
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

<OnboardingLayout onBackClick={handleBackClick} {busy} reverseContent={$mobile}>
    <div slot="title" class:pb-2={$mobile}>
        <Text type="h2">{locale('views.recoveryPhrase.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{locale('views.recoveryPhrase.body1')}</Text>
        <Text type="p" secondary highlighted classes="font-bold mb-4">{locale('views.recoveryPhrase.body2')}</Text>
        <Text type="p" secondary classes="mb-4">{locale('views.recoveryPhrase.body3')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#if !$mobile}
            <Button secondary classes="w-full" onClick={() => handleDownloadClick()}>
                {locale('actions.downloadRecoveryKit')}
            </Button>
        {/if}
        <Button
            disabled={!$mobile && !hasRevealedRecoveryPhrase}
            classes="w-full"
            onClick={hasRevealedRecoveryPhrase ? () => handleContinueClick(false) : handleMnemonicVisibilityClick}
        >
            {locale(
                $mobile && !hasRevealedRecoveryPhrase ? 'views.recoveryPhrase.revealRecoveryPhrase' : 'actions.continue'
            )}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex flex-col items-center justify-center {$mobile ? 'p-0' : 'p-4'}">
        {#if mnemonic !== undefined && mnemonic !== null}
            <RecoveryPhrase classes="mb-8" recoveryPhrase={mnemonic} {hide} />
            {#if !$mobile}
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
        {/if}
    </div>
</OnboardingLayout>
