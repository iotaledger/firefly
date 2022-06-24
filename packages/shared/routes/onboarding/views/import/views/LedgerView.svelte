<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol } from '@core/network'
    import { newProfile } from '@core/profile'
    import { ProfileRecoveryType } from '@contexts/onboarding'

    const dispatch = createEventDispatcher()

    function handleContinueClick(importType: ProfileRecoveryType): void {
        dispatch('next', { importType })
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.importFromLedger.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.importFromLedger.body')}</Text>
        <Button
            icon="settings"
            classes="w-full mb-5"
            secondary
            onClick={() => handleContinueClick(ProfileRecoveryType.FireflyLedger)}
        >
            {localize('views.importFromLedger.haveFireflyLedger')}
            <Text type="p" secondary smaller>{localize('views.importFromLedger.haveFireflyLedgerDescription')}</Text>
        </Button>
        <Button
            icon="settings"
            classes="w-full mb-8"
            secondary
            hidden={$newProfile.networkProtocol === NetworkProtocol.Shimmer}
            onClick={() => handleContinueClick(ProfileRecoveryType.TrinityLedger)}
        >
            {localize('views.importFromLedger.haveTrinityLedger')}
            <Text type="p" secondary smaller>{localize('views.importFromLedger.haveTrinityLedgerDescription')}</Text>
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
