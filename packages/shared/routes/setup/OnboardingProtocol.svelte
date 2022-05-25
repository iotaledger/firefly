<script lang="typescript">
    import { appRouter } from '@core/router'
    import { createNewProfile, deleteNewProfile } from '@core/profile'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { mobile } from '@lib/app'
    import { Button, OnboardingLayout, Text } from 'shared/components'

    const isDeveloperProfile = true // TODO: use real value

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if (!isDeveloperProfile) {
            await createNewProfile(isDeveloperProfile, networkProtocol, NetworkType.Mainnet)
        }
        $appRouter.next({ networkProtocol })
    }
    async function onBackClick(): Promise<void> {
        await deleteNewProfile()
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
