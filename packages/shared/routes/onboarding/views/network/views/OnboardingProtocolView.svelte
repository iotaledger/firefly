<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { networkRouter } from '@core/router'
    import {
        cleanupOnboarding,
        newProfile,
        updateNewProfile,
        initProfileManagerFromNewProfile,
    } from '@contexts/onboarding'

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if ($newProfile?.isDeveloperProfile) {
            updateNewProfile({ networkProtocol })
        } else {
            updateNewProfile({ networkProtocol, networkType: NetworkType.Mainnet })
            await initProfileManagerFromNewProfile()
        }
        $networkRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $networkRouter.previous()
    }
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
            <Button
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                classes="w-full"
                secondary
                hidden={$newProfile?.isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                disabled={$newProfile?.isDeveloperProfile
                    ? !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled
                    : !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled ||
                      !features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.enabled}
                onClick={() => onClick(NetworkProtocol[protocol])}
            >
                {protocol}
                {#if !$newProfile?.isDeveloperProfile}
                    <Text secondary smaller>{localize(`views.protocol.${NetworkProtocol[protocol]}`)}</Text>
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
