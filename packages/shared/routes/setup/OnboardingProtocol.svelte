<script lang="typescript">
    import { appRouter } from '@core/router'
    import { localize } from '@core/i18n'
    import { NetworkProtocol } from '@core/network'
    import { cleanupOnboarding } from '@contexts/onboarding'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { networkProtocol as networkProtocolStore } from '@contexts/onboarding'
    import features from 'shared/features/features'

    const isDeveloperProfile = true // TODO: use real value

    function onClick(networkProtocol: NetworkProtocol): void {
        networkProtocolStore.set(networkProtocol)
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
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkProtocol) as protocol}
            <Button
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                classes="w-full"
                secondary
                hidden={features?.onboarding?.[NetworkProtocol[protocol]]?.hidden}
                disabled={!features?.onboarding?.[NetworkProtocol[protocol]]?.enabled}
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
