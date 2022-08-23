<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { StakingAirdrop } from 'shared/lib/participation/types'
    import { capitalize } from 'shared/lib/utils'

    export let airdrop: StakingAirdrop
    export let infoBox: { title?: string; body?: string[] }

    const handleLearnMoreClick = (): void => {
        const url = getLearnMoreUrl()
        if (!url) {
            showAppNotification({
                type: 'error',
                message: localize('error.participation.cannotVisitAirdropWebsite', {
                    values: { airdrop: capitalize(airdrop) },
                }),
            })
        }
        Platform.openUrl(getLearnMoreUrl())
    }
    const getLearnMoreUrl = (): string => {
        switch (airdrop) {
            case StakingAirdrop.Assembly:
                return 'https://assembly.sc'
            case StakingAirdrop.Shimmer:
                return 'https://shimmer.network'
            default:
                return ''
        }
    }
</script>

<div class="mb-5 text-center">
    <Text type="h4">{localize(`popups.${airdrop}-info.title`)}</Text>
</div>
<Illustration illustration="{airdrop}-info-bg" classes="relative w-full rounded-2xl mb-7" />
<div class="flex flex-col flex-wrap space-y-3">
    {#if infoBox}
        <div class="text-left p-2 rounded-lg flex flex-col space-y-2 bg-gray-50 dark:bg-gray-700">
            <Text type="p" bold>{infoBox?.title}</Text>
            {#each infoBox?.body as paragraph}
                <Text type="p" secondary>
                    {paragraph}
                </Text>
            {/each}
        </div>
    {/if}
    <Text type="p">{localize(`popups.${airdrop}-info.body1`)}</Text>
    <Text type="p">{localize(`popups.${airdrop}-info.body2`)}</Text>
    <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.visitWebsite')}</Link>
</div>
