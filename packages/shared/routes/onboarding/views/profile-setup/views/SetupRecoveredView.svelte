<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { profileSetupRouter } from '@core/router'
    import {
        onboardingProfile,
        profileRecoveryType,
        ProfileRecoveryType,
        setNewProfileType,
    } from '@contexts/onboarding'

    function handleContinueClick(_profileRecoveryType: ProfileRecoveryType) {
        const profileType =
            _profileRecoveryType === ProfileRecoveryType.Ledger ? ProfileType.Ledger : ProfileType.Software
        setNewProfileType(profileType)

        profileRecoveryType.set(_profileRecoveryType)
        $profileSetupRouter.next({ profileRecoveryType: _profileRecoveryType })
    }
    function handleBackClick() {
        $profileSetupRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.import.title.${$onboardingProfile?.networkProtocol}`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize(`views.import.body.${$onboardingProfile?.networkProtocol}`)}</Text
        >
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <Button
            icon="seed"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.migrateSeed?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.migrateSeed?.enabled}
            onClick={() => handleContinueClick(ProfileRecoveryType.Seed)}
        >
            {localize('views.import.importSeed')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.import.importSeedDescription')}</Text>
            {/if}
        </Button>
        <Button
            icon="language"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => handleContinueClick(ProfileRecoveryType.Mnemonic)}
        >
            {localize('views.import.importMnemonic')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.import.importMnemonicDescription')}</Text>
            {/if}
        </Button>
        <Button
            icon="file"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => handleContinueClick(ProfileRecoveryType.Stronghold)}
        >
            {localize(`views.import.importFile.${$onboardingProfile?.networkProtocol}`)}
            {#if !$mobile}
                <Text type="p" secondary smaller>
                    {localize(`views.import.importFileDescription.${$onboardingProfile?.networkProtocol}`)}
                </Text>
            {/if}
        </Button>
        {#if !$mobile}
            <Button
                icon="chip"
                classes="w-full mb-8"
                secondary
                hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.restoreProfile?.ledgerBackup?.hidden}
                disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[
                    $onboardingProfile?.networkType
                ]?.restoreProfile?.ledgerBackup?.enabled}
                onClick={() => handleContinueClick(ProfileRecoveryType.Ledger)}
            >
                {localize('views.import.importLedger')}
                {#if !$mobile}
                    <Text type="p" secondary smaller>
                        {localize(`views.import.importLedgerDescription.${$onboardingProfile?.networkProtocol}`)}
                    </Text>
                {/if}
            </Button>
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
