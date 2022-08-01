<script lang="typescript">
    import { Animation, OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import {
        cleanupOnboarding,
        createNewProfile,
        initProfileManagerFromNewProfile,
        onboardingProfile,
        updateOnboardingProfile,
    } from '@contexts/onboarding'
    import { AppStage, appStage, mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { INode, NetworkProtocol, NetworkType } from '@core/network'
    import { networkSetupRouter } from '@core/router'
    import features from 'shared/features/features'
    import { onMount } from 'svelte'

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if ($onboardingProfile?.isDeveloperProfile) {
            updateOnboardingProfile({ networkProtocol })
        } else {
            updateOnboardingProfile({ networkProtocol, networkType: NetworkType.Mainnet })
            await initProfileManagerFromNewProfile(<INode>{}, true)
        }
        $networkSetupRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $networkSetupRouter.previous()
    }

    onMount(() => {
        if (!$onboardingProfile?.id) {
            createNewProfile({ isDeveloperProfile: $appStage !== AppStage.PROD })
        }
    })
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.protocol.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.protocol.body')}</Text>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkProtocol) as protocol}
            <OnboardingButton
                primaryText={protocol}
                secondaryText={!$onboardingProfile?.isDeveloperProfile
                    ? localize(`views.protocol.${NetworkProtocol[protocol]}`)
                    : ''}
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
                onClick={() => onClick(NetworkProtocol[protocol])}
            />
        {/each}
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-yellow dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" animation="onboarding-protocol-desktop" />
    </div>
</OnboardingLayout>
