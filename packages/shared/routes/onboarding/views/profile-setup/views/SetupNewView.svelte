<script lang="typescript">
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType } from '@core/profile'
    import { setNewProfileType, newProfile } from '@contexts/onboarding'
    import { profileSetupRouter } from '@core/router'
    import { onMount } from 'svelte'

    function handleContinueClick(profileType: ProfileType): void {
        setNewProfileType(profileType)
        $profileSetupRouter.next()
    }

    function handleBackClick(): void {
        $profileSetupRouter.previous()
    }

    onMount(() => {
        setNewProfileType(null)
    })
</script>

<OnboardingLayout onBackClick={handleBackClick}>
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
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.softwareProfile?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.softwareProfile?.enabled}
            onClick={() => handleContinueClick(ProfileType.Software)}
        />
        <OnboardingButton
            primaryText={localize('views.create.ledgerAccount.title')}
            secondaryText={!$mobile ? localize('views.create.ledgerAccount.description') : ''}
            icon="chip"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.ledgerProfile?.enabled}
            onClick={() => handleContinueClick(ProfileType.Ledger)}
        />
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
