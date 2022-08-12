<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Icon, OnboardingLayout, RecoveryPhrase, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '@core/router'
    import {
        onboardingProfile,
        generateMnemonicForOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { downloadRecoveryKit } from '@lib/utils'

    const busy = false
    let hide = true
    let hasRevealedRecoveryPhrase = false

    function handleContinueClick(): void {
        $profileBackupRouter.next()
    }

    function handleBackClick(): void {
        updateOnboardingProfile({ mnemonic: null })
        $profileBackupRouter.previous()
    }

    function handleMnemonicVisibilityClick(): void {
        hide = !hide
        hasRevealedRecoveryPhrase = true
    }

    function handleDownloadClick(): void {
        downloadRecoveryKit()
    }

    onMount(() => {
        generateMnemonicForOnboardingProfile()
    })
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy} reverseContent={$mobile}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileBackup.viewMnemonic.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileBackup.viewMnemonic.body1')}</Text>
        <Text type="p" secondary highlighted classes="font-bold mb-4"
            >{localize('views.onboarding.profileBackup.viewMnemonic.body2')}</Text
        >
        <Text type="p" secondary classes="mb-4">{localize('views.onboarding.profileBackup.viewMnemonic.body3')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#if !$mobile}
            <Button secondary classes="w-full" onClick={handleDownloadClick}>
                {localize('actions.downloadRecoveryKit')}
            </Button>
        {/if}
        <Button
            disabled={!$mobile && !hasRevealedRecoveryPhrase}
            classes="w-full"
            onClick={hasRevealedRecoveryPhrase ? () => handleContinueClick() : handleMnemonicVisibilityClick}
        >
            {localize(
                $mobile && !hasRevealedRecoveryPhrase
                    ? 'views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase'
                    : 'actions.continue'
            )}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex flex-col items-center justify-center {$mobile ? 'p-0' : 'p-4'}">
        {#if $onboardingProfile?.mnemonic}
            <RecoveryPhrase classes="mb-8" recoveryPhrase={$onboardingProfile?.mnemonic} {hide} />
            {#if !$mobile}
                {#if !hasRevealedRecoveryPhrase}
                    {#if hide}
                        <Button onClick={handleMnemonicVisibilityClick} classes="absolute">
                            {localize('views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase')}
                        </Button>
                    {/if}
                {:else}
                    <button
                        on:click={handleMnemonicVisibilityClick}
                        class="absolute top-10 right-10 flex flex-row items-center highlight"
                        type="button"
                    >
                        <Text smaller overrideColor classes="text-blue-500 mr-2">
                            {localize(
                                `views.onboarding.profileBackup.viewMnemonic.${
                                    hide ? 'revealRecoveryPhrase' : 'hideRecoveryPhrase'
                                }`
                            )}
                        </Text>
                        <Icon icon={hide ? 'view' : 'hide'} classes="text-blue-500" />
                    </button>
                {/if}
            {/if}
        {/if}
    </div>
</OnboardingLayout>

<style type="text/scss">
    .highlight {
        transition: filter 0.2s;

        &:focus {
            filter: brightness(1.3);
        }
    }
</style>
