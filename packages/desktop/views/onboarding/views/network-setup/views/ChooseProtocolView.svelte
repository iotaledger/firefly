<script lang="typescript">
    import { onMount } from 'svelte'
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from '@features/features'
    import { cleanupOnboarding, onboardingProfile, updateOnboardingProfile } from '@contexts/onboarding'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { networkSetupRouter } from '@core/router'
    import { resetActiveProfile } from '@core/profile'

    function onProtocolSelectionClick(networkProtocol: NetworkProtocol): void {
        if ($onboardingProfile?.isDeveloperProfile) {
            updateOnboardingProfile({ networkProtocol })
        } else {
            updateOnboardingProfile({ networkProtocol, networkType: NetworkType.Mainnet })
        }
        $networkSetupRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $networkSetupRouter.previous()
    }

    onMount(() => {
        resetActiveProfile()
        updateOnboardingProfile({ networkProtocol: null })
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.onboarding.networkSetup.chooseProtocol.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.onboarding.networkSetup.chooseProtocol.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkProtocol) as protocol}
            <OnboardingButton
                primaryText={protocol}
                secondaryText={localize(`views.onboarding.networkSetup.chooseProtocol.${NetworkProtocol[protocol]}`)}
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                hidden={$onboardingProfile?.isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                disabled={$onboardingProfile?.isDeveloperProfile
                    ? !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled
                    : !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled ||
                      !features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.enabled}
                onClick={() => onProtocolSelectionClick(NetworkProtocol[protocol])}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-protocol-desktop" />
    </div>
</OnboardingLayout>
