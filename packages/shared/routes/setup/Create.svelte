<script lang="typescript">
    import { appRouter } from '@core/router'

    import { Animation, Button, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { setProfileType } from 'shared/lib/profile'
    import { Locale } from '@core/i18n'
    import { ProfileType } from 'shared/lib/typings/profile'

    export let locale: Locale

    function handleContinueClick(profileType: ProfileType): void {
        setProfileType(profileType)
        $appRouter.next()
    }
    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.create.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text type="p" secondary classes="mb-8">{locale('views.create.body')}</Text>
        <Button
            icon="settings"
            classes="w-full mb-5"
            secondary
            onClick={() => handleContinueClick(ProfileType.Software)}
        >
            {locale('views.create.softwareAccount.title')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('views.create.softwareAccount.description')}</Text>
            {/if}
        </Button>
        {#if !$mobile}
            <Button
                icon="settings"
                classes="w-full mb-8"
                secondary
                onClick={() => handleContinueClick(ProfileType.Ledger)}
            >
                {locale('views.create.ledgerAccount.title')}
                <Text type="p" secondary smaller>{locale('views.create.ledgerAccount.description')}</Text>
            </Button>
        {/if}
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-purple dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation="import-desktop"
        />
    </div>
</OnboardingLayout>
