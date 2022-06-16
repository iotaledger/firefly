<script lang="typescript">
    import { appRouter } from '@core/router'
    import { createNewProfile, newProfile, updateNewProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { cleanupOnboarding } from '@contexts/onboarding'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'

    $: isDeveloperProfile = $newProfile?.isDeveloperProfile

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if (!isDeveloperProfile) {
            await createNewProfile(isDeveloperProfile, networkProtocol, NetworkType.Mainnet)
        } else {
            updateNewProfile({ networkProtocol })
        }
        $appRouter.next()
    }
    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $appRouter.previous()
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
                hidden={isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                disabled={isDeveloperProfile
                    ? !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled
                    : !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled ||
                      !features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.enabled}
                onClick={() => onClick(NetworkProtocol[protocol])}
            >
                {protocol}
                {#if !isDeveloperProfile}
                    <Text secondary smaller>{localize(`views.protocol.${NetworkProtocol[protocol]}`)}</Text>
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
