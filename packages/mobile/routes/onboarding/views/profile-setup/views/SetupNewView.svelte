<script lang="typescript">
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'
    import { Animation, OnboardingButton, Text } from 'shared/components'
    import features from '@features/features'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager'
    import {
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { profileSetupRouter } from '@core/router'

    function onProfileTypeSelectionClick(type: ProfileType): void {
        updateOnboardingProfile({ type })
        initialiseProfileManagerFromOnboardingProfile()
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        destroyProfileManager()
        updateOnboardingProfile({ type: null, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileSetup.setupNew.title')}</Text>
    </div>
    <div slot="illustration" class="w-full h-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
    <div slot="content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupNew.body')}</Text>
    </div>
    <div slot="footer" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.description')}
            icon="file"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.enabled}
            onClick={() => onProfileTypeSelectionClick(ProfileType.Software)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.title')}
            secondaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.description')}
            icon="chip"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.ledgerProfile?.enabled}
            onClick={() => onProfileTypeSelectionClick(ProfileType.Ledger)}
        />
    </div>
</OnboardingLayout>
