<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { profileSetupRouter } from '@core/router'
    import {
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileRecoveryType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        const type = getProfileTypeFromProfileRecoveryType(recoveryType)
        updateOnboardingProfile({ type, recoveryType })
        await initialiseProfileManagerFromOnboardingProfile(true)
        $profileSetupRouter.next()
    }
    function onBackClick() {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        void resetOnboardingProfileWithProfileManager()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.setupRecovered.title', {
                values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={!$mobile
                ? localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')
                : ''}
            icon="language"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={!$mobile
                ? localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')
                : ''}
            icon="file"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
        {#if !$mobile}
            <OnboardingButton
                primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
                secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
                icon="chip"
                hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.restoreProfile?.ledgerBackup?.hidden}
                disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[
                    $onboardingProfile?.networkType
                ]?.restoreProfile?.ledgerBackup?.enabled}
                onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Ledger)}
            />
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
