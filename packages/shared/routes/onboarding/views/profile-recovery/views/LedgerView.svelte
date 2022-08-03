<script lang="typescript">
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol } from '@core/network'
    import { profileRecoveryRouter } from '@core/router'
    import { onboardingProfile, ProfileRecoveryType } from '@contexts/onboarding'

    function handleContinueClick(): void {
        $profileRecoveryRouter.next()
    }

    function handleBackClick(): void {
        $profileRecoveryRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.importFromLedger.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.importFromLedger.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.importFromLedger.haveFireflyLedger')}
            secondaryText={localize('views.importFromLedger.haveFireflyLedgerDescription')}
            icon="settings"
            onClick={() => handleContinueClick(ProfileRecoveryType.FireflyLedger)}
        />
        <OnboardingButton
            primaryText={localize('views.importFromLedger.haveTrinityLedger')}
            secondaryText={localize('views.importFromLedger.haveTrinityLedgerDescription')}
            icon="settings"
            hidden={$onboardingProfile.networkProtocol === NetworkProtocol.Shimmer}
            onClick={() => handleContinueClick(ProfileRecoveryType.TrinityLedger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
