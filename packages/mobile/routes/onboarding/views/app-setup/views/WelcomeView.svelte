<script lang="typescript">
    import { Animation, Button, Logo, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import { appSetupRouter } from '@core/router'

    function onContinueClick(): void {
        $appSetupRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="flex flex-col {$mobile && 'items-center text-center px-10'} space-y-4 mb-8">
            LOLAAAAA
            {#if !$mobile}
                <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            {/if}
            <Text type={$mobile ? 'h3' : 'h1'}
                >{localize('views.onboarding.appSetup.welcome.title', {
                    values: {
                        protocol: features?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}</Text
            >
            <Text type="p" secondary
                >{localize('views.onboarding.appSetup.welcome.body', {
                    values: {
                        protocol: features?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}</Text
            >
        </div>
    </div>
    <div slot="leftpane__action">
        <Button onClick={onContinueClick} classes="w-full">{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="welcome-desktop" />
    </div>
</OnboardingLayout>
