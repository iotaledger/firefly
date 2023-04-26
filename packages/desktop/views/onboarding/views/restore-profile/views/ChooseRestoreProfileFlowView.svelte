<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        ProfileRecoveryType,
        RestoreProfileType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId } from '@core/network'
    import { ProfileType } from '@core/profile'
    import features from '@features/features'
    import { Animation, OnboardingButton, Text } from '@ui'
    import { onMount } from 'svelte'
    import { restoreProfileRouter } from '../restore-profile-router'

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    const networkId = $onboardingProfile?.network?.id

    async function onProfileRecoverySelectionClick(restoreProfileType: RestoreProfileType): Promise<void> {
        isBusy = { ...isBusy, [restoreProfileType]: true }
        const type = restoreProfileType === RestoreProfileType.Ledger ? ProfileType.Ledger : ProfileType.Software
        updateOnboardingProfile({ type, restoreProfileType })
        await initialiseProfileManagerFromOnboardingProfile(true)
        $restoreProfileRouter.next()
    }

    function onBackClick(): void {
        $restoreProfileRouter.previous()
    }

    onMount(() => {
        void resetOnboardingProfileWithProfileManager()
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2"
            >{localize('views.onboarding.profileSetup.setupRecovered.title', {
                values: { network: getNetworkNameFromNetworkId(networkId) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonicDescription')}
            icon="language"
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importFileDescription')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Stronghold)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedger')}
            secondaryText={localize('views.onboarding.profileSetup.setupRecovered.importLedgerDescription')}
            icon="chip"
            busy={isBusy[ProfileRecoveryType.Ledger]}
            hidden={features?.onboarding?.[networkId]?.restoreProfile?.ledgerBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.restoreProfile?.ledgerBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-purple dark:bg-gray-900">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
