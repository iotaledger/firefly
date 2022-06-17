<script lang="typescript">
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { createNewProfile, newProfile, updateNewProfile } from '@core/profile'
    import { NetworkType } from '@core/network'
    import { appRouter } from '@core/router'
    import { OnboardingButton, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'
    import { cleanupOnboarding } from '@contexts/onboarding'

    const networkIcon = {
        [NetworkType.Mainnet]: $newProfile?.networkProtocol,
        [NetworkType.Devnet]: 'settings',
        [NetworkType.PrivateNet]: 'settings',
    }

    async function onClick(networkType: NetworkType): Promise<void> {
        await createNewProfile($newProfile?.isDeveloperProfile, $newProfile?.networkProtocol, networkType)
        $appRouter.next({ networkType })
    }

    async function onBackClick(): Promise<void> {
        const isDeveloperProfile = $newProfile.isDeveloperProfile
        await cleanupOnboarding(true)
        updateNewProfile({ isDeveloperProfile })
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
            <OnboardingButton
                icon={networkIcon[networkType]}
                iconColor={networkType === NetworkType.Mainnet
                    ? `${$newProfile?.networkProtocol}-highlight`
                    : 'blue-500'}
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
            </OnboardingButton>
        {/each}
    </div>
</OnboardingLayout>
