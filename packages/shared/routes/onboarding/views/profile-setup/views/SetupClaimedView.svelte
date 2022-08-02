<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileSetupRouter } from '@core/router'
    import {
        createIotaProfileManager,
        ProfileRecoveryType,
        onboardingProfile,
        destroyIotaProfileManager,
        updateOnboardingProfile,
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
    } from '@contexts/onboarding'

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        await createIotaProfileManager()

        const type = getProfileTypeFromProfileRecoveryType(recoveryType)
        updateOnboardingProfile({ type, recoveryType })
        await initialiseProfileManagerFromOnboardingProfile()
        $profileSetupRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await destroyIotaProfileManager()
        $profileSetupRouter.previous()
    }

    onMount(() => {
        updateOnboardingProfile({ type: null, recoveryType: null })
        void destroyIotaProfileManager()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.import.title.${$onboardingProfile?.networkProtocol}`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8"
            >{localize(`views.import.body.${$onboardingProfile?.networkProtocol}`)}</Text
        >
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.import.importSeed')}
            secondaryText={!$mobile ? localize('views.import.importSeedDescription') : ''}
            icon="seed"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.migrateSeed?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.migrateSeed?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Seed)}
        />
        <OnboardingButton
            primaryText={localize('views.import.importMnemonic')}
            secondaryText={!$mobile ? localize('views.import.importMnemonicDescription') : ''}
            icon="language"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize(`views.import.importFile.${$onboardingProfile?.networkProtocol}`)}
            secondaryText={!$mobile
                ? localize(`views.import.importFileDescription.${$onboardingProfile?.networkProtocol}`)
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
                primaryText={localize('views.import.importLedger')}
                secondaryText={!$mobile
                    ? localize(`views.import.importLedgerDescription.${$onboardingProfile?.networkProtocol}`)
                    : ''}
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
