<script lang="ts">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, Text } from '@ui'
    import { OnboardingLayout } from '@components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { destroyProfileManager } from '@core/profile-manager'
    import {
        initialiseProfileManagerFromOnboardingProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { profileSetupRouter } from '@core/router'

    async function onProfileTypeSelectionClick(type: ProfileType): Promise<void> {
        updateOnboardingProfile({ type })
        await initialiseProfileManagerFromOnboardingProfile()
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(async () => {
        await destroyProfileManager()
        updateOnboardingProfile({ type: null, hasInitialisedProfileManager: false })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.profileSetup.setupNew.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.onboarding.profileSetup.setupNew.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.softwareAccount.title')}
            secondaryText={!$mobile
                ? localize('views.onboarding.profileSetup.setupNew.softwareAccount.description')
                : ''}
            icon="file"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.enabled}
            onClick={() => onProfileTypeSelectionClick(ProfileType.Software)}
        />
        <OnboardingButton
            primaryText={localize('views.onboarding.profileSetup.setupNew.ledgerAccount.title')}
            secondaryText={!$mobile ? localize('views.onboarding.profileSetup.setupNew.ledgerAccount.description') : ''}
            icon="chip"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.ledgerProfile?.enabled}
            onClick={() => onProfileTypeSelectionClick(ProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
