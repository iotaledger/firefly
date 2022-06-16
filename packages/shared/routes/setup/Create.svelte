<script lang="typescript">
    import { appRouter } from '@core/router'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType, setNewProfileType, newProfile } from '@core/profile'
    import features from 'shared/features/features'

    function handleContinueClick(profileType: ProfileType): void {
        setNewProfileType(profileType)
        $appRouter.next()
    }

    function handleBackClick(): void {
        $appRouter.previous()
    }
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
            icon="file"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.sofwareProfile?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.sofwareProfile?.enabled}
            onClick={() => handleContinueClick(ProfileType.Software)}
        >
            {localize('views.create.softwareAccount.title')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.create.softwareAccount.description')}</Text>
            {/if}
        </OnboardingButton>
        <OnboardingButton
            icon="chip"
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.ledgerProfile?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.ledgerProfile?.enabled}
            onClick={() => handleContinueClick(ProfileType.Ledger)}
        >
            {localize('views.create.ledgerAccount.title')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.create.ledgerAccount.description')}</Text>
            {/if}
        </OnboardingButton>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
