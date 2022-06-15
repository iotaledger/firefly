<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { createNewProfile } from '@core/profile'
    import { NetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import { networkProtocol } from '@contexts/onboarding'
    import featureFlags from 'shared/featureFlags.config'

    const networkIcon = {
        [NetworkType.Mainnet]: $networkProtocol,
        [NetworkType.Devnet]: 'settings',
        [NetworkType.PrivateNet]: 'settings',
    }

    const isDeveloperProfile = true // TODO: use real value

    async function onClick(networkType: NetworkType): Promise<void> {
        if (networkType !== NetworkType.PrivateNet) {
            await createNewProfile(isDeveloperProfile, $networkProtocol, networkType)
        }
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
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkType) as networkType}
            <Button
                icon={networkIcon[NetworkType[networkType]]}
                classes="w-full"
                secondary
                disabled={!featureFlags?.onboarding?.[$networkProtocol]?.[NetworkType[networkType]]?.enabled}
                onClick={() => onClick(NetworkType[networkType])}
            >
                {localize(`views.network.${NetworkType[networkType]}.title`)}
                {#if !$mobile}
                    <Text secondary smaller>{localize(`views.network.${NetworkType[networkType]}.body`)}</Text>
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
