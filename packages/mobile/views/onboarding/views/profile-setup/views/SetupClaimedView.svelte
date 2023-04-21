<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'

    import { showAppNotification } from '@auxiliary/notification'
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

    import { profileSetupRouter } from '@/routers'
    import features from '@features/features'

    type SupportedRecoveryTypes = ProfileRecoveryType.Mnemonic | ProfileRecoveryType.Stronghold

    const title = localize('views.onboarding.profileSetup.setupClaimed.title')

    const isBusy: Record<SupportedRecoveryTypes, boolean> = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
    }

    const isDisabled: Record<SupportedRecoveryTypes, boolean> = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
    }

    async function onProfileRecoverySelectionClick(recoveryType: SupportedRecoveryTypes): Promise<void> {
        isBusy[recoveryType] = true
        Object.keys(isDisabled).forEach((type) => (isDisabled[type] = recoveryType !== type))

        try {
            const type = getProfileTypeFromProfileRecoveryType(recoveryType)
            updateOnboardingProfile({ type, recoveryType, shimmerClaimingAccounts: [] })
            await initialiseProfileManagerFromOnboardingProfile(true)
            await createShimmerClaimingProfileManager()
            $profileSetupRouter.next()
        } catch (error) {
            showAppNotification({
                type: 'error',
                message: localize(error),
            })
        } finally {
            isBusy[recoveryType] = false
            Object.keys(isDisabled).forEach((type) => (isDisabled[type] = false))
        }

        if (Object.values(isBusy).some((value) => value === true)) {
            return
        } else {
            isBusy[recoveryType] = true
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
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8">
            {localize('views.onboarding.profileSetup.setupClaimed.body')}
        </Text>
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        {@const claimRewardsFeature =
            features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards}
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            icon="language"
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={claimRewardsFeature?.recoveryPhrase?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Mnemonic] || !claimRewardsFeature?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={claimRewardsFeature?.strongholdBackup?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Stronghold] || !claimRewardsFeature?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
    </div>
</OnboardingLayout>
