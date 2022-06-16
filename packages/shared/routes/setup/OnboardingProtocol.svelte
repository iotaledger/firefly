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
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#each Object.keys(NetworkProtocol) as protocol}
            <Button
                icon={NetworkProtocol[protocol]}
                iconColor={`${NetworkProtocol[protocol]}-highlight`}
                classes="w-full"
                secondary
                disabled={!featureFlags?.onboarding?.[NetworkProtocol[protocol]]?.enabled}
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
