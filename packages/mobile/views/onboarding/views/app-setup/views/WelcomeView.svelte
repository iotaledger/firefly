<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Button, Checkbox, Link, Text, TextType } from '@ui'

    import {
        hasCompletedAppSetup,
        lastAcceptedPrivacyPolicy,
        lastAcceptedTermsOfService,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol, NetworkType } from '@core/network'

    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import features from '@features/features'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { appSetupRouter } from '@/routers'

    let termsAccepted = false

    function onContinueClick(): void {
        hasCompletedAppSetup.set(true)
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        $appSetupRouter.next()
    }

    onMount(async () => {
        await initialiseOnboardingProfile(
            $onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile(),
            NetworkProtocol.Shimmer
        )
        if (!shouldBeDeveloperProfile()) {
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
        }
    })

    function onShowLegalClick(): void {
        openDrawer({ id: DrawerId.Legal, props: { fullScreen: true } })
    }
</script>

<OnboardingLayout allowBack={false} animation="welcome-desktop">
    <div slot="content">
        <div class="flex flex-col items-center text-center px-8 pb-12">
            <Text type={TextType.h3}>
                {localize('views.onboarding.appSetup.welcome.title', {
                    values: {
                        protocol: features?.onboarding?.iota?.enabled
                            ? formatProtocolName(NetworkProtocol.IOTA)
                            : formatProtocolName(NetworkProtocol.Shimmer),
                    },
                })}
            </Text>
        </div>
    </div>
    <div slot="footer" class="space-y-8">
        <div class="flex flex-col space-y-4">
            <Link onClick={onShowLegalClick}>
                {localize('views.onboarding.appSetup.legal.title')}
            </Link>
            <div class="flex flex-row items-center space-x-3">
                <Checkbox bind:checked={termsAccepted} />
                <Text type={TextType.p} secondary>
                    {localize('views.onboarding.appSetup.legal.checkbox')}
                </Text>
            </div>
        </div>
        <Button disabled={!termsAccepted} onClick={onContinueClick} classes="w-full"
            >{localize('actions.continue')}</Button
        >
    </div>
</OnboardingLayout>
