<script lang="typescript">
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { ProfileType, setNewProfileType, newProfile } from '@core/profile'
    import { appRouter } from '@core/router'

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
        <Button
            icon="file"
            classes="w-full"
            secondary
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
        </Button>
        <Button
            icon="chip"
            classes="w-full mb-8"
            secondary
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
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-purple dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="import-desktop" />
    </div>
</OnboardingLayout>
