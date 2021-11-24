<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { StakingAirdrop, StakingHeader, StakingInfo, StakingSummary } from './views'
    import { StakingAirdrop as Airdrop } from 'shared/lib/typings/participation'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
</script>

<style type="text/scss">
    :global(body.platform-win32) .staking-wrapper {
        @apply pt-0;
    }
</style>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    <StakingHeader {locale} />
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3">
            <DashboardPane classes="w-full">
                <StakingSummary {locale} />
            </DashboardPane>
            <DashboardPane classes="w-full flex-grow">
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
