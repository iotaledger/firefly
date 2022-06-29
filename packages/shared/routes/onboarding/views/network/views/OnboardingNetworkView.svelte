<script lang="typescript">
    import { Button, OnboardingLayout, Text } from 'shared/components'
    import { TextType } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { NetworkType } from '@core/network'
    import { networkRouter } from '@core/router'
    import {
        cleanupOnboarding,
        newProfile,
        updateNewProfile,
        initProfileManagerFromNewProfile,
    } from '@contexts/onboarding'

    const networkProtocol = $newProfile.networkProtocol

    const networkIcon: Readonly<{ [key in NetworkType]: string }> = {
        [NetworkType.Mainnet]: networkProtocol,
        [NetworkType.Devnet]: 'settings',
        [NetworkType.PrivateNet]: 'settings',
    }

    async function onClick(networkType: NetworkType): Promise<void> {
        if (networkType === NetworkType.PrivateNet) {
            updateNewProfile({ networkType })
        } else {
            updateNewProfile({ networkProtocol, networkType })
            await initProfileManagerFromNewProfile()
        }
        $networkRouter.next({ networkType })
    }

    async function onBackClick(): Promise<void> {
        const isDeveloperProfile = $newProfile.isDeveloperProfile
        await cleanupOnboarding(true)
        updateNewProfile({ isDeveloperProfile })
        $networkRouter.previous()
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
                iconColor={networkType === NetworkType.Mainnet ? `${networkProtocol}-highlight` : 'blue-500'}
                classes="w-full"
                secondary
                hidden={features?.onboarding?.[networkProtocol]?.[networkType]?.hidden}
                disabled={!features?.onboarding?.[networkProtocol]?.[networkType]?.enabled}
                onClick={() => onClick(networkType)}
            >
                {localize(`views.network.${networkProtocol}.${networkType}.title`)}
                {#if !$mobile}
                    <Text secondary smaller>{localize(`views.network.${networkProtocol}.${networkType}.body`)}</Text>
                {/if}
            </Button>
        {/each}
    </div>
</OnboardingLayout>
