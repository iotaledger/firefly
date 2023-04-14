<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'

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
    import { localize } from '@core/i18n'

    import { profileSetupRouter } from '@/routers'
    import features from '@features/features'

    const RECOVERY_TYPES = [ProfileRecoveryType.Mnemonic, ProfileRecoveryType.Stronghold, ProfileRecoveryType.Ledger]
    const title = localize('views.onboarding.profileSetup.setupClaimed.title')

    let isBusy = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
        [ProfileRecoveryType.Ledger]: false,
    }
    let isDisabled = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
        [ProfileRecoveryType.Ledger]: false,
    }

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        isBusy = { ...isBusy, ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: type === recoveryType }), {}) }
        isDisabled = {
            ...isDisabled,
            ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: type !== recoveryType }), {}),
        }
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
            isBusy = { ...isBusy, ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {}) }
            isDisabled = { ...isDisabled, ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {}) }
        }
        if (Object.keys(isBusy).some((key) => isBusy[key])) {
            return
        } else {
            isBusy = { ...isBusy, [recoveryType]: true }
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
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.recoveryPhrase?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Mnemonic] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.claimRewards?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.claimRewards?.strongholdBackup?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Stronghold] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.claimRewards?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
    </div>
</OnboardingLayout>
