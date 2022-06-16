<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { newProfile } from '@core/profile'
    import { NetworkType, updateNewProfileNetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'

    const networkIcon = {
        [NetworkType.Mainnet]: $newProfile?.networkProtocol,
        [NetworkType.Devnet]: 'settings',
        [NetworkType.PrivateNet]: 'settings',
    }

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
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.values(NetworkType) as networkType}
            <Button
                icon={networkIcon[networkType]}
                iconColor={networkType === NetworkType.Mainnet
                    ? `${$newProfile?.networkProtocol}-highlight`
                    : 'blue-500'}
                classes="w-full"
                secondary
                hidden={features?.onboarding?.[$newProfile?.networkProtocol]?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[$newProfile?.networkProtocol]?.[networkType]?.enabled}
                onClick={() => onClick(networkType)}
            >
                {localize(`views.network.${$newProfile?.networkProtocol}.${networkType}.title`)}
                {#if !$mobile}
                    <Text secondary smaller
                        >{localize(`views.network.${$newProfile?.networkProtocol}.${networkType}.body`)}</Text
                    >
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
