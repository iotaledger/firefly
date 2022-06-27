<script lang="typescript">
    import { OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { createNewProfile, newProfile, updateNewProfile } from '@core/profile'
    import { appRouter } from '@core/router'
    import { cleanupOnboarding } from '@contexts/onboarding'

    $: isDeveloperProfile = $newProfile?.isDeveloperProfile

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if (isDeveloperProfile) {
            updateNewProfile({ networkProtocol })
        } else {
            await createNewProfile(isDeveloperProfile, networkProtocol, NetworkType.Mainnet)
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
            <OnboardingButton
                primaryText={protocol}
                secondaryText={!isDeveloperProfile ? localize(`views.protocol.${NetworkProtocol[protocol]}`) : ''}
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                hidden={isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                disabled={isDeveloperProfile
                    ? !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled
                    : !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled ||
                      !features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.enabled}
                onClick={() => onClick(NetworkProtocol[protocol])}
            />
        {/each}
    </div>
</OnboardingLayout>
