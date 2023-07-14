<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Button, Text, TextType, RecoveryPhrase } from '@ui'

    import { localize } from '@core/i18n'

    import {
        generateMnemonicForOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    import { profileBackupRouter } from '@/routers'

    let isHidden: boolean = true
    let hasRevealedRecoveryPhrase: boolean = false

    function onContinueClick(): void {
        $profileBackupRouter.next()
    }

    function onBackClick(): void {
        updateOnboardingProfile({ mnemonic: null })
        $profileBackupRouter.previous()
    }

    function onMnemonicVisibilityClick(): void {
        isHidden = !isHidden
        hasRevealedRecoveryPhrase = true
    }

    onMount(() => {
        generateMnemonicForOnboardingProfile()
    })
</script>

<OnboardingLayout {onBackClick} title={localize('views.onboarding.profileBackup.viewMnemonic.title')}>
    <content-container slot="content" class="w-full h-full flex flex-col p-0">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-4">
            {localize('views.onboarding.profileBackup.viewMnemonic.body1')}
        </Text>
        <Text type={TextType.p} secondary fontSize="15" classes="mb-4">
            {localize('views.onboarding.profileBackup.viewMnemonic.body3')}
        </Text>
        <Text type={TextType.p} secondary overrideColor color="gray-800" fontSize="15" classes="font-bold mb-4">
            {localize('views.onboarding.profileBackup.viewMnemonic.body2')}
        </Text>
        {#if $onboardingProfile?.mnemonic}
            <RecoveryPhrase recoveryPhrase={$onboardingProfile?.mnemonic} blurred={isHidden} boxed />
        {/if}
    </content-container>
    <footer-container slot="footer" class="block">
        {#if !hasRevealedRecoveryPhrase}
            <Button classes="w-full" onClick={hasRevealedRecoveryPhrase ? onContinueClick : onMnemonicVisibilityClick}>
                {localize(
                    !hasRevealedRecoveryPhrase
                        ? 'views.onboarding.profileBackup.viewMnemonic.revealRecoveryPhrase'
                        : 'actions.continue'
                )}
            </Button>
        {:else}
            <Button classes="w-full" onClick={hasRevealedRecoveryPhrase ? onContinueClick : onMnemonicVisibilityClick}>
                {localize('actions.continue')}
            </Button>
        {/if}
    </footer-container>
</OnboardingLayout>
