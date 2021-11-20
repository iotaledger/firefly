<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { DashboardPane } from 'shared/components'
    import { StakingAirdrop, StakingHeader, StakingInfo, StakingActions } from './views'
    import { StakingAirdrop as Airdrop } from 'shared/lib/typings/participation'
    import { Locale } from 'shared/lib/typings/i18n'

    import { getParticipationOverview, getParticipationEvents, participateWithRemainingFunds } from 'shared/lib/participation'

    export let locale: Locale

    onMount(async () => {
        await getParticipationOverview()
        await getParticipationEvents()

        await participateWithRemainingFunds('wallet-account://5617300f2f424d8ac236eef8d3163a8b95f275ce5c519a6434e12e987137a295')
    })
</script>

<style type="text/scss">
    :global(body.platform-win32) .staking-wrapper {
        @apply pt-0;
    }
</style>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap p-10 flex-1 bg-gray-50 dark:bg-gray-900">
    <StakingHeader {locale} />
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3">
            <DashboardPane classes="w-full h-1/3">
                <StakingActions {locale} />
            </DashboardPane>
            <DashboardPane classes="w-full h-2/3">
                <StakingInfo {locale} />
            </DashboardPane>
        </div>
        <DashboardPane classes="h-full">
            <StakingAirdrop {locale} airdrop={Airdrop.Assembly} />
        </DashboardPane>
        <DashboardPane classes="h-full">
            <StakingAirdrop {locale} airdrop={Airdrop.Shimmer} />
        </DashboardPane>
    </div>
</div>
