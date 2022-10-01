<script lang="typescript">
    import { localize } from '@core/i18n'
    import { formatProtocolName, NetworkProtocol, NetworkType } from '@core/network'
    import { appSetupRouter } from '@core/router'
    import features from '@features/features'
    import { Button, Checkbox, Text } from 'shared/components'
    import {
        initialiseOnboardingProfile,
        onboardingProfile,
        shouldBeDeveloperProfile,
        updateOnboardingProfile,
    } from 'shared/lib/contexts/onboarding'
    import { onMount } from 'svelte'
    import { OnboardingLayout } from '../../../../../components'

    let checked = false

    function onContinueClick(): void {
        $appSetupRouter.next()
    }

    onMount(() => {
        initialiseOnboardingProfile(
            $onboardingProfile?.isDeveloperProfile ?? shouldBeDeveloperProfile(),
            NetworkProtocol.Shimmer
        )
        if (!shouldBeDeveloperProfile()) {
            updateOnboardingProfile({ networkType: NetworkType.Mainnet })
        }
    })
</script>

<OnboardingLayout allowBack={false} animation="welcome-desktop">
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
