<script lang="typescript">
    import { Platform } from 'shared/lib/platform'
    import { Animation, Link, Logo, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { Locale } from '@core/i18n'
    import { newProfile } from '@core/profile'
    import { SetupType } from 'shared/lib/typings/setup'
    import { appRouter } from '@core/router'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import features from 'shared/features/features'

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
        <Text type="h2"
            >{locale('views.setup.title', {
                values: { protocol: formatProtocolName($newProfile?.networkProtocol) },
            })}</Text
        >
    </div>
    <div slot="leftpane__content" class:hidden={$newProfile?.networkProtocol !== NetworkProtocol.IOTA}>
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
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        <OnboardingButton
            icon="tokens"
            iconHeight="24"
            iconWidth="24"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.claimRewards
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.claimRewards
                ?.enabled}
            onClick={() => {}}
        >
            {locale('actions.claimShimmer')}
            {#if !$mobile}
                <Text type="p" secondary smaller>{locale('actions.claimShimmerDescription')}</Text>
            {/if}
        </OnboardingButton>
        <OnboardingButton
            icon="plus"
            iconHeight="11"
            iconWidth="11"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.newProfile
                ?.enabled}
            onClick={() => handleContinueClick(SetupType.New)}
        >
            {locale('actions.createWallet', { values: { protocol: formatProtocolName($newProfile?.networkProtocol) } })}
            {#if !$mobile}
                <Text type="p" secondary smaller
                    >{locale('actions.createWalletDescription', {
                        values: { protocol: $newProfile?.networkProtocol },
                    })}</Text
                >
            {/if}
        </OnboardingButton>
        <OnboardingButton
            icon="transfer"
            classes="w-full"
            secondary
            hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.hidden}
            disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[$newProfile?.networkType]?.restoreProfile
                ?.enabled}
            onClick={() => handleContinueClick(SetupType.Import)}
        >
            {locale(`actions.restoreWallet.${$newProfile?.networkProtocol}`)}
            {#if !$mobile}
                <Text type="p" secondary smaller
                    >{locale(`actions.restoreWalletDescription.${$newProfile?.networkProtocol}`)}</Text
                >
            {/if}
        </OnboardingButton>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="setup-desktop" />
    </div>
</OnboardingLayout>
