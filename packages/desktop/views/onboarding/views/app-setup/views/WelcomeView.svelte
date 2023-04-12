<script lang="ts">
    import { OnboardingLayout } from '@components'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, formatProtocolName } from '@core/network'
    import { appSetupRouter } from '@core/router'
    import features from '@features/features'
    import { Animation, Button, Logo, Text, TextType } from '@ui'

    function onContinueClick(): void {
        $appSetupRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <div class="flex flex-col space-y-4 mb-8">
            <Logo width="64px" logo="logo-firefly" classes="mb-6" />
            <Text type={TextType.h1}
                >{localize('views.onboarding.appSetup.welcome.title', {
                    values: {
                        protocol: features?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}
            </Text>
        </div>
    </div>
    <div slot="leftpane__action">
        <Button onClick={onContinueClick} classes="w-full">{localize('actions.continue')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio" animation="welcome-desktop" />
    </div>
</OnboardingLayout>
