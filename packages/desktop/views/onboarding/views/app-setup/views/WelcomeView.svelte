<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, formatProtocolName } from '@core/network'
    import { appSetupRouter } from '@core/router'
    import features from '@features/features'
    import { Animation, Button, Checkbox, Text, TextType, Link } from '@ui'

    let termsAccepted: boolean = false

    function onTermsOfServiceClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onPrivacyPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    function onContinueClick(): void {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        $appSetupRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
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
    <div slot="leftpane__action" class="flex flex-col space-y-8">
        <Checkbox bind:checked={termsAccepted}>
            <Text slot="label" type={TextType.p} secondary>
                I've read and I accept the <Link onClick={onTermsOfServiceClick}>Terms of Service</Link> and <Link
                    onClick={onPrivacyPolicyClick}>Privacy Policy</Link
                >
            </Text>
        </Checkbox>
        <Button classes="w-full" disabled={!termsAccepted} onClick={onContinueClick}
            >{localize('actions.continue')}</Button
        >
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center">
        <Animation classes="setup-anim-aspect-ratio" animation="welcome-desktop" />
    </div>
</OnboardingLayout>
