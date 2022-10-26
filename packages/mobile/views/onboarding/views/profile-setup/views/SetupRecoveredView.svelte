<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { OnboardingButton, Text, TextType } from 'shared/components'
    import features from '../../../../../features/features'
    import { localize } from '@core/i18n'
    import { formatProtocolName } from '@core/network'
    import { profileSetupRouter } from '../../../../../lib/routers'
    import {
        getProfileTypeFromProfileRecoveryType,
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        ProfileRecoveryType,
        resetOnboardingProfileWithProfileManager,
        updateOnboardingProfile,
    } from '@contexts/onboarding'

    const title = localize('views.onboarding.profileSetup.setupRecovered.title', {
        values: { protocol: formatProtocolName($onboardingProfile?.networkProtocol) },
    })

    let isBusy = {
        [ProfileRecoveryType.Mnemonic]: false,
        [ProfileRecoveryType.Stronghold]: false,
        [ProfileRecoveryType.Ledger]: false,
    }

    async function onProfileRecoverySelectionClick(recoveryType: ProfileRecoveryType): Promise<void> {
        isBusy = { ...isBusy, [recoveryType]: true }
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

<OnboardingLayout {onBackClick} {title} animation="import-desktop">
    <div slot="content">
        <Text type={TextType.p} secondary classes="mb-8"
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
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.recoveryPhrase?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Mnemonic)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupRecovered.importFile')}
            icon="file"
            busy={isBusy[ProfileRecoveryType.Stronghold]}
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.restoreProfile?.strongholdBackup?.enabled}
            onClick={() => onProfileRecoverySelectionClick(ProfileRecoveryType.Stronghold)}
        />
    </div>
</OnboardingLayout>
