<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Button, Checkbox, Link, Text, TextType } from '@ui'

    import { initialiseOnboardingFlow, onboardingProfile, shouldBeDeveloperProfile } from '@contexts/onboarding'
    import {
        hasCompletedAppSetup,
        lastAcceptedPrivacyPolicy,
        lastAcceptedTermsOfService,
        PRIVACY_POLICY_VERSION,
        TERMS_OF_SERVICE_VERSION,
    } from '@core/app'
    import { localize } from '@core/i18n'
    import { getNetworkNameFromNetworkId, NetworkId } from '@core/network'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { appSetupRouter } from '@/routers'
    import features from '@features/features'

    let termsAccepted = false

    function onContinueClick(): void {
        hasCompletedAppSetup.set(true)
        lastAcceptedTermsOfService.set(TERMS_OF_SERVICE_VERSION)
        lastAcceptedPrivacyPolicy.set(PRIVACY_POLICY_VERSION)
        $appSetupRouter.next()
    }

    onMount(async () => {
        const isDeveloperProfile = $onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile()
        await initialiseOnboardingFlow({
            isDeveloperProfile,
            ...(!isDeveloperProfile && { networkId: NetworkId.Shimmer }),
        })
    })

    function onShowLegalClick(): void {
        openDrawer(DrawerId.Legal, { fullScreen: true })
    }
</script>

<OnboardingLayout allowBack={false} animation="welcome-desktop">
    <div slot="content">
        <div class="flex flex-col items-center text-center px-8 pb-12">
            <Text type={TextType.h3}>
                {localize('views.onboarding.appSetup.welcome.title', {
                    values: {
                        network: features?.onboarding?.iota?.enabled
                            ? getNetworkNameFromNetworkId(NetworkId.Iota)
                            : getNetworkNameFromNetworkId(NetworkId.Shimmer),
                    },
                })}
            </Text>
        </div>
    </div>
    <div slot="footer" class="space-y-8">
        <div class="flex flex-col space-y-4">
            <Link on:click={onShowLegalClick}>
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
