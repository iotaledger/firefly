<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { StakingAirdrop, StakingInfo, StakingManager } from './views'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale
</script>

<style type="text/scss">
    :global(body.platform-win32) .staking-wrapper {
        @apply pt-0;
    }
</style>

<div class="staking-wrapper w-full h-full flex flex-col p-10 flex-1 bg-gray-50 dark:bg-gray-900">
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3">
            <DashboardPane classes="w-full h-1/3">
                <StakingManager {locale} />
            </DashboardPane>
            <DashboardPane classes="w-full h-2/3">
                <StakingInfo {locale} />
            </DashboardPane>
        </div>
        <DashboardPane classes="h-full">
            <StakingAirdrop {locale} airdrop={'assembly'} />
        </DashboardPane>
        <DashboardPane classes="h-full">
            <StakingAirdrop {locale} airdrop={'shimmer'}/>
        </DashboardPane>
    </div>
</div>
