<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'

    import { showAppNotification } from '@auxiliary/notification'
    import {
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileRecoveryType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'

    import { profileSetupRouter } from '@/routers'
    import features from '@features/features'

    const RECOVERY_TYPES = Object.values(ProfileRecoveryType)
    const title = localize('views.onboarding.profileSetup.setupRecovered.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

    let isBusy = RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
    let isDisabled = RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        isBusy = { ...isBusy, ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: type === recoveryType }), {}) }
        isDisabled = {
            ...isDisabled,
            ...RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: type !== recoveryType }), {}),
        }
        try {
            const type = getProfileTypeFromProfileRecoveryType(recoveryType)
            updateOnboardingProfile({ type, recoveryType })
            await initialiseProfileManagerFromOnboardingProfile(true)
            $profileSetupRouter.next()
        } catch (error) {
            showAppNotification({
                type: 'error',
                message: localize(error),
            })
        } finally {
            isBusy = RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
            isDisabled = RECOVERY_TYPES.reduce((obj, type) => ({ ...obj, [type]: false }), {})
        }
    }

    function onBackClick() {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        void resetOnboardingProfileWithProfileManager()
    })
</script>

<OnboardingLayout {onBackClick} {title} animation="import-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8"
            >{localize('views.onboarding.profileSetup.setupRecovered.body')}</Text
        >
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            icon="language"
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Mnemonic] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Stronghold] ||
                !features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                    ?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
    </div>
</OnboardingLayout>
