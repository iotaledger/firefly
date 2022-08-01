<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { profileSetupRouter } from '@core/router'

    function onProfileTypeSelectionClick(type: ProfileType): void {
        updateOnboardingProfile({ type })
        // TODO: Initialise profile manager here since we have all of the necessary configuration parameters!
        $profileSetupRouter.next()
    }

    function onBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        updateOnboardingProfile({ type: null })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.create.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{localize('views.create.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            primaryText={localize('views.create.softwareAccount.title')}
            secondaryText={!$mobile ? localize('views.create.softwareAccount.description') : ''}
            icon="file"
            hidden={features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[$onboardingProfile?.networkProtocol]?.[$onboardingProfile?.networkType]
                ?.newProfile?.softwareProfile?.enabled}
            onClick={() => onProfileTypeSelectionClick(ProfileType.Software)}
        />
        <OnboardingButton
            primaryText={localize('views.create.ledgerAccount.title')}
            secondaryText={!$mobile ? localize('views.create.ledgerAccount.description') : ''}
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
