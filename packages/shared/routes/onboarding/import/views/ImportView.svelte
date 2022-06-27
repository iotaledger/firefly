<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { newProfile, ProfileImportType, ProfileType, setNewProfileType } from '@core/profile'

    const dispatch = createEventDispatcher()

    function handleContinueClick(importType: ProfileImportType): void {
        const profileType = importType === ProfileImportType.Ledger ? ProfileType.Ledger : ProfileType.Software
        setNewProfileType(profileType)
        dispatch('next', { importType })
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{localize(`views.import.title.${$newProfile?.networkProtocol}`)}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize(`views.import.body.${$newProfile?.networkProtocol}`)}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.import.importSeed')}
            secondaryText={!$mobile ? localize('views.import.importSeedDescription') : ''}
            icon="seed"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.migrateSeed?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.migrateSeed?.enabled}
            onClick={() => handleContinueClick(ProfileImportType.Seed)}
        />
        <OnboardingButton
            primaryText={localize('views.import.importMnemonic')}
            secondaryText={!$mobile ? localize('views.import.importMnemonicDescription') : ''}
            icon="language"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.recoveryPhrase?.enabled}
            onClick={() => handleContinueClick(ProfileImportType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize(`views.import.importFile.${$newProfile?.networkProtocol}`)}
            secondaryText={!$mobile
                ? localize(`views.import.importFileDescription.${$newProfile?.networkProtocol}`)
                : ''}
            icon="file"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.strongholdBackup?.enabled}
            onClick={() => handleContinueClick(ProfileImportType.File)}
        />
        {#if !$mobile}
            <OnboardingButton
                primaryText={localize('views.import.importLedger')}
                secondaryText={!$mobile
                    ? localize(`views.import.importLedgerDescription.${$newProfile?.networkProtocol}`)
                    : ''}
                icon="chip"
                hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                    ?.ledgerBackup?.hidden}
                disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]
                    ?.restoreProfile?.ledgerBackup?.enabled}
                onClick={() => handleContinueClick(ProfileImportType.Ledger)}
            />
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
