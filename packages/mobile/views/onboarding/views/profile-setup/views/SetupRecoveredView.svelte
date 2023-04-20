<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { OnboardingButton, Text, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'

    import { showAppNotification } from '@auxiliary/notification'
    import {
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

    const title = localize('views.onboarding.profileSetup.setupRecovered.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

    const isBusy: Record<SupportedRecoveryTypes, boolean> = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
    }

    const isDisabled: Record<SupportedRecoveryTypes, boolean> = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
    }

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        isBusy[recoveryType] = true
        Object.keys(isDisabled).forEach((type) => (isDisabled[type] = recoveryType !== type))

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
            isBusy[recoveryType] = true
            Object.keys(isDisabled).forEach((type) => (isDisabled[type] = false))
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
        <Text type={TextType.p} secondary fontSize="15" classes="mb-8">
            {localize('views.onboarding.profileSetup.setupRecovered.body')}
        </Text>
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        {@const restoreProfileFeature =
            features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile}
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importMnemonic')}
            icon="language"
            busy={isBusy[ProfileRecoveryType.Mnemonic]}
            hidden={restoreProfileFeature?.recoveryPhrase?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Mnemonic] || !restoreProfileFeature?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={restoreProfileFeature?.strongholdBackup?.hidden}
            disabled={isDisabled[ProfileRecoveryType.Stronghold] || !restoreProfileFeature?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
    </div>
</OnboardingLayout>
