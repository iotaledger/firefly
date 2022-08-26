<script lang="typescript">
    import { Platform } from 'shared/lib/platform'
    import { Animation, Button, Link, Logo, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { Locale } from '@core/i18n'
    import { SetupType } from 'shared/lib/typings/setup'
    import { appRouter } from '@core/router'

    export let locale: Locale

    function handleContinueClick(setupType: SetupType): void {
        $appRouter.next({ setupType })
    }

    function handleBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="title">
        <Text type="h2">{locale('views.setup.title')}</Text>
    </div>
    <div slot="leftpane__content">
        {#if !$mobile}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-16 p-8 pt-16">
                <div class="absolute -top-14">
                    <Logo width="auto" height="auto" logo="logo-chrysalis-gem" />
                </div>
                <Text type="h3" classes="mb-6 text-center">{locale('views.setup.chrysalisTitle')}</Text>
                <Text type="p" secondary classes="mb-8">{locale('views.setup.chrysalisBody')}</Text>
                <Link onClick={() => Platform.openUrl('https://blog.iota.org/firefly-token-migration/')}>
                    {locale('views.setup.learnMore')}
                </Link>
            </div>
        {/if}
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <Button
            icon="plus"
            iconHeight="15"
            iconWidth="15"
            classes="w-full"
            secondary
            onClick={() => handleContinueClick(SetupType.New)}
        >
            {locale('actions.createWallet')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('actions.createWalletDescription')}</Text>
            {/if}
        </Button>
        <Button icon="transfer" classes="w-full" secondary onClick={() => handleContinueClick(SetupType.Import)}>
            {locale('actions.restoreWallet')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('actions.restoreWalletDescription')}</Text>
            {/if}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-blue dark:bg-gray-900'}"
    >
        <Animation
            classes="setup-anim-aspect-ratio {$mobile ? 'transform scale-120' : ''}"
            animation={$mobile ? 'profile-desktop' : 'setup-desktop'}
        />
    </div>
</OnboardingLayout>
