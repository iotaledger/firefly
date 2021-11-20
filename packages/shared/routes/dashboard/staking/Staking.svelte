<script lang="typescript">
    import { onMount } from 'svelte'
    import { DashboardPane } from 'shared/components'
    import { StakingAirdrop, StakingHeader, StakingInfo, StakingSummary } from './views'
    import { StakingAirdrop as Airdrop } from 'shared/lib/typings/participation'
    import { Locale } from 'shared/lib/typings/i18n'

    import {
        getParticipationEvents,
        pollParticipationOverview
    } from 'shared/lib/participation'

    export let locale: Locale

    onMount(async () => {
        await getParticipationEvents()
        await pollParticipationOverview()
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
                <StakingSummary {locale} />
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
