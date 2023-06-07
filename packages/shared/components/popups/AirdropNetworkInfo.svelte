<script lang="typescript">
    import { Illustration, Link, Text } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { localize } from '@core/i18n'
    import { showAppNotification } from 'shared/lib/notifications'
    import { StakingAirdrop } from 'shared/lib/participation/types'
    import { capitalize } from 'shared/lib/utils'

    export let airdrop: StakingAirdrop

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
    <Text type="p">{localize(`popups.${airdrop}-info.body1`)}</Text>
    <Link onClick={handleLearnMoreClick} classes="text-14">{localize('actions.visitWebsite')}</Link>
</div>
