<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout, RecoveryPhrase } from '../../../../../components'
    import { Button, Text, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { profileBackupRouter } from '../../../../../lib/routers'
    import {
        onboardingProfile,
        generateMnemonicForOnboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    const busy = false
    const title = localize('views.onboarding.profileBackup.viewMnemonic.title')

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

    onMount(() => {
        generateMnemonicForOnboardingProfile()
    })
</script>

<OnboardingLayout onBackClick={handleBackClick} {busy} {title}>
    <div slot="content" class="w-full h-full flex flex-col p-0">
        <Text type={TextType.p} secondary classes="mb-4"
            >{localize('views.onboarding.profileBackup.viewMnemonic.body1')}</Text
        >
        <Text type={TextType.p} secondary classes="mb-4"
            >{localize('views.onboarding.profileBackup.viewMnemonic.body3')}</Text
        >
        <Text type={TextType.p} secondary overrideColor color="gray-800" classes="font-bold mb-4"
            >{localize('views.onboarding.profileBackup.viewMnemonic.body2')}</Text
        >
        {#if $onboardingProfile?.mnemonic}
            <RecoveryPhrase classes="mb-8" recoveryPhrase={$onboardingProfile?.mnemonic} {hide} />
        {/if}
    </div>
    <div slot="footer">
        {#if hasRevealedRecoveryPhrase === false}
            <Button
                classes="w-full"
                onClick={hasRevealedRecoveryPhrase ? handleContinueClick : handleMnemonicVisibilityClick}
            >
                {localize(
                    !hasRevealedRecoveryPhrase
                        ? 'views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase'
                        : 'actions.continue'
                )}
            </Button>
        {:else}
            <Button
                classes="w-full"
                onClick={hasRevealedRecoveryPhrase ? handleContinueClick : handleMnemonicVisibilityClick}
            >
                {localize('actions.continue')}
            </Button>
        {/if}
    </div>
</OnboardingLayout>
