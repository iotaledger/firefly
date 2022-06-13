<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { newProfile } from '@core/profile'
    import { NetworkType, updateNewProfileNetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import featureFlags from 'shared/featureFlags.config'

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
        {#each Object.keys(NetworkType) as networkType}
            <Button
                icon="settings"
                classes="w-full"
                secondary
                disabled={!featureFlags?.onboarding?.[$newProfile?.networkProtocol]?.[NetworkType[networkType]]
                    ?.enabled}
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
