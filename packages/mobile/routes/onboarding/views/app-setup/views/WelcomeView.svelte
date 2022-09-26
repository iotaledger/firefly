<script lang="typescript">
    import { OnboardingLayout } from '../../../../../components'
    import { Animation, Button, Text, Checkbox } from 'shared/components'
    import features from '@features/features'
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol } from '@core/network'
    import { appSetupRouter } from '@core/router'

    let checked = false

    function onContinueClick(): void {
        $appSetupRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="illustration" class="w-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio transform scale-180 absolute left-32" animation="welcome-desktop" />
    </div>
    <div slot="content">
        <div class="flex flex-col items-center text-center space-y-4 absolute bottom-1/4 px-8">
            <Text type="h3"
                >{localize('views.onboarding.appSetup.welcome.title', {
                    values: {
                        protocol: features?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}</Text
            >
        </div>
    </div>
    <div slot="footer" class="space-y-8">
        <div class="flex flex-row items-center space-x-3">
            <Checkbox bind:checked />
            <Text type="p" secondary>
                I agree to the
                <span class="text-blue-500"> Terms of Service </span>
            </Text>
        </div>
        <Button onClick={onContinueClick} classes="w-full">{localize('actions.continue')}</Button>
    </div>
</OnboardingLayout>
