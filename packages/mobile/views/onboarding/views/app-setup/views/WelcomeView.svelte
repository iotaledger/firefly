<script lang="ts">
    import { onMount } from 'svelte'

    import { OnboardingLayout } from '@components'
    import { Button, Checkbox, Link, Text, TextType } from '@ui'

    import { hasCompletedAppSetup } from '@core/app'
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
        openDrawer(DrawerId.Legal, { fullScreen: true })
    }
</script>

<OnboardingLayout allowBack={false} animation="welcome-desktop">
    <div slot="content">
        <div class="flex flex-col items-center text-center space-y-4 absolute bottom-1/4 px-8">
            <Text type={TextType.h3}
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
            <Checkbox bind:checked={termsAccepted} />
            <Text type={TextType.p} secondary>
                I agree to the
                <Link onClick={onShowLegalClick}>
                    {localize('popups.legalUpdate.tosTitle')}
                </Link>
            </Text>
        </div>
        <Button disabled={!termsAccepted} onClick={onContinueClick} classes="w-full"
            >{localize('actions.continue')}</Button
        >
    </div>
</OnboardingLayout>
