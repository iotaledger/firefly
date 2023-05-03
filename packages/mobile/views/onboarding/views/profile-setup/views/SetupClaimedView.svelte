<script lang="ts">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'
    import features from '@features/features'
    import { localize } from '@core/i18n'
    import { profileSetupRouter } from '@/routers'
    import {
        createShimmerClaimingProfileManager,
        destroyShimmerClaimingProfileManager,
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        RestoreProfileType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    const title = localize('views.onboarding.profileSetup.setupClaimed.title')

    let isBusy = {
        [RestoreProfileType.Mnemonic]: false,
        [RestoreProfileType.Stronghold]: false,
        [RestoreProfileType.Ledger]: false,
    }

    const networkId = $onboardingProfile?.network?.id

    async function onProfileRecoverySelectionClick(restoreProfileType: RestoreProfileType): Promise<void> {
        if (Object.keys(isBusy).some((key) => isBusy[key])) {
            return
        } else {
            isBusy = { ...isBusy, [restoreProfileType]: true }
            const type = getProfileTypeFromProfileRecoveryType(restoreProfileType)
            updateOnboardingProfile({ type, restoreProfileType, shimmerClaimingAccounts: [] })
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

<OnboardingLayout {onBackClick} {title} animation="import-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8"
            >{localize('views.onboarding.profileSetup.setupClaimed.body')}</Text
        >
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            icon="language"
            busy={isBusy[RestoreProfileType.Mnemonic]}
            hidden={features?.onboarding?.[networkId]?.claimRewards?.recoveryPhrase?.hidden}
            disabled={!features?.onboarding?.[networkId]?.claimRewards?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[RestoreProfileType.Stronghold]}
            hidden={features?.onboarding?.[networkId]?.claimRewards?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[networkId]?.claimRewards?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(RestoreProfileType.Stronghold)}
        />
    </div>
</OnboardingLayout>
