<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { newProfile } from '@core/profile'
    import { NetworkType, updateNewProfileNetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import featureFlags from 'shared/featureFlags.config'

    const networkTypes = Object.keys(NetworkType).filter(
        (networkType) => NetworkType[networkType] !== NetworkType.PrivateNet
    ) // TODO: add support for custom networks

    const networkEnabledMapping: Map<NetworkType, boolean> = new Map(
        Object.values(NetworkType).map((network) => [
            network,
            featureFlags?.onboarding?.[$newProfile?.networkProtocol]?.[network]?.enabled,
        ])
    )

    function onClick(networkType: NetworkType): void {
        updateNewProfileNetworkType(networkType)
        $appRouter.next({ networkType })
    }
    function onBackClick(): void {
        $appRouter.previous()
    }
</script>

<OnboardingLayout {onBackClick}>
    <div slot="title">
        <Text type={TextType.h2}>{localize('views.network.title')}</Text>
    </div>
    <div slot="leftpane__content">
        <Text secondary classes="mb-8">{localize('views.network.body')}</Text>
        <ul>
            {#each networkTypes as networkType}
                <li>
                    <Button
                        icon="settings"
                        classes="w-full mb-5"
                        secondary
                        disabled={!networkEnabledMapping.get(NetworkType[networkType])}
                        onClick={() => onClick(NetworkType[networkType])}
                    >
                        {localize(`views.network.${NetworkType[networkType]}.title`)}
                        {#if !$mobile}
                            <Text secondary smaller>{localize(`views.network.${NetworkType[networkType]}.body`)}</Text>
                        {/if}
                    </Button>
                </li>
            {/each}
        </ul>
    </div>
</OnboardingLayout>
