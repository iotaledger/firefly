<script lang="typescript">
    import { appRouter } from '@core/router'
    import { createNewProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { mobile } from '@core/app'
    import { cleanupOnboarding } from '@contexts/onboarding'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import featureFlags from 'shared/featureFlags.config'

    const isDeveloperProfile = true // TODO: use real value
    const protocolEnabledMapping: Map<NetworkProtocol, boolean> = new Map(
        Object.values(NetworkProtocol).map((protocol) => [protocol, featureFlags?.onboarding?.[protocol]?.enabled])
    )

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        await createNewProfile(isDeveloperProfile, networkProtocol, NetworkType.Devnet)
        $appRouter.next()
    }
    async function onBackClick(): Promise<void> {
        await cleanupOnboarding()
        $appRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type="h2">{localize('views.protocol.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.protocol.body')}</Text>
        <ul>
            {#each Object.keys(NetworkProtocol) as protocol}
                <li>
                    <Button
                        icon={NetworkProtocol[protocol]}
                        iconColor={`${NetworkProtocol[protocol]}-highlight`}
                        classes="w-full mb-5"
                        secondary
                        disabled={!protocolEnabledMapping.get(NetworkProtocol[protocol])}
                        onClick={() => onClick(NetworkProtocol[protocol])}
                    >
                        {protocol}
                        {#if !$mobile}
                            <Text secondary smaller>{localize(`views.protocol.${NetworkProtocol[protocol]}`)}</Text>
                        {/if}
                    </Button>
                </li>
            {/each}
        </ul>
    </div>
</OnboardingLayout>
