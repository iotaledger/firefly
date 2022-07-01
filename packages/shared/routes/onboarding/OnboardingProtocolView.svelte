<script lang="typescript">
    import {
        cleanupOnboarding,
        createNewProfile,
        initProfileManagerFromNewProfile,
        newProfile,
        updateNewProfile,
    } from '@contexts/onboarding'
    import { AppStage, appStage } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkProtocol, NetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import features from 'shared/features/features'
    import { onMount } from 'svelte'

    async function onClick(networkProtocol: NetworkProtocol): Promise<void> {
        if ($newProfile?.isDeveloperProfile) {
            updateNewProfile({ networkProtocol })
        } else {
            updateNewProfile({ networkProtocol, networkType: NetworkType.Mainnet })
            await initProfileManagerFromNewProfile()
        }
        $appRouter.next()
    }

    async function onBackClick(): Promise<void> {
        await cleanupOnboarding(true)
        $appRouter.previous()
    }

    onMount(() => {
        if (!$newProfile?.id) {
            createNewProfile({ isDeveloperProfile: $appStage !== AppStage.PROD })
        }
    })
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
                hidden={$newProfile?.isDeveloperProfile
                    ? features?.onboarding?.[NetworkProtocol[protocol]]?.hidden
                    : features?.onboarding?.[NetworkProtocol[protocol]]?.hidden ||
                      features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.hidden}
                disabled={$newProfile?.isDeveloperProfile
                    ? !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled
                    : !features?.onboarding?.[NetworkProtocol[protocol]]?.enabled ||
                      !features?.onboarding?.[NetworkProtocol[protocol]]?.[NetworkType.Mainnet]?.enabled}
                onClick={() => onClick(NetworkProtocol[protocol])}
            >
                {protocol}
                {#if !$newProfile?.isDeveloperProfile}
                    <Text secondary smaller>{localize(`views.protocol.${NetworkProtocol[protocol]}`)}</Text>
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
