<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { profileSetupRouter } from '@core/router'
    import {
        createShimmerClaimingProfileManager,
        destroyShimmerClaimingProfileManager,
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileRecoveryType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    let isBusy = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
        [ProfileRecoveryType.Ledger]: false,
    }

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        if (Object.keys(isBusy).some((key) => isBusy[key])) {
            return
        } else {
            isBusy = { ...isBusy, [recoveryType]: true }
            const type = getProfileTypeFromProfileRecoveryType(recoveryType)
            updateOnboardingProfile({ type, recoveryType, shimmerClaimingAccounts: [] })
            await initialiseProfileManagerFromOnboardingProfile(true)
            await createShimmerClaimingProfileManager()
            $profileSetupRouter.next()
        }
    }
    function onBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        destroyShimmerClaimingProfileManager()
        void resetOnboardingProfileWithProfileManager()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileSetup.setupClaimed.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupClaimed.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={!$mobile
                ? localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')
                : ''}
            icon="language"
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={!$mobile
                ? localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')
                : ''}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
        {#if !$mobile}
            <OnboardingButton
                primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
                secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
                icon="chip"
                busy={isBusy[ProfileRecoveryType.Ledger]}
                hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.claimRewards?.ledgerBackup?.hidden}
                disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[
                    $onboardingProfile?.networkType
                ]?.claimRewards?.ledgerBackup?.enabled}
                onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Ledger)}
            />
        {/if}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
