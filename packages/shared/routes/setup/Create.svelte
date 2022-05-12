<script lang="typescript">
    import { appRouter } from '@core/router'
    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { ProfileType, setNewProfileType } from '@core/profile'

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
        <Button
            icon="settings"
            classes="w-full mb-5"
            secondary
            onClick={() => handleContinueClick(ProfileType.Software)}
        >
            {localize('views.create.softwareAccount.title')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{localize('views.create.softwareAccount.description')}</Text>
            {/if}
        </Button>
        <Button icon="settings" classes="w-full mb-8" secondary onClick={() => handleContinueClick(ProfileType.Ledger)}>
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
