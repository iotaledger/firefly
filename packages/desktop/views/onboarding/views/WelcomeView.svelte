<script lang="ts">
    import { OnboardingLayout } from '@components'
    import {
        PRIVACY_POLICY_URL,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_URL,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app/constants'
    import { hasCompletedAppSetup, lastAcceptedPrivacyPolicy, lastAcceptedTermsOfService } from '@core/app/stores'
    import { openUrlInBrowser } from '@core/app/utils'
    import { localize } from '@core/i18n'
    import { NetworkId, getNetworkNameFromNetworkId } from '@core/network'
    import features from '@features/features'
    import { Animation, Button, Checkbox, Link, Text, TextType } from '@ui'
    import { onboardingRouter } from '../onboarding-router'
    import { initialiseOnboardingProfile } from '@contexts/onboarding/actions'
    import { shouldBeDeveloperProfile } from '@contexts/onboarding/utils'

    let termsAccepted: boolean = false

    function onTermsOfServiceClick(): void {
        openUrlInBrowser(TERMS_OF_SERVICE_URL)
    }

    function onPrivacyPolicyClick(): void {
        openUrlInBrowser(PRIVACY_POLICY_URL)
    }

    async function onContinueClick(): Promise<void> {
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        hasCompletedAppSetup.set(true)
        await initialiseOnboardingProfile(shouldBeDeveloperProfile())
        $onboardingRouter.next()
    }
</script>

<OnboardingLayout allowBack={false}>
    <div slot="leftpane__content">
        <Text type={TextType.h1}
            >{localize('views.onboarding.appSetup.welcome.title', {
                values: {
                    network: features?.onboarding?.iota?.enabled
                        ? getNetworkNameFromNetworkId(NetworkId.Iota)
                        : getNetworkNameFromNetworkId(NetworkId.Shimmer),
                },
            })}
        </Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-8">
        <Checkbox bind:checked={termsAccepted}>
            <Text slot="label" type={TextType.p} secondary>
                I've read and I accept the <Link on:click={onTermsOfServiceClick}>Terms of Service</Link> and <Link
                    on:click={onPrivacyPolicyClick}>Privacy Policy</Link
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
