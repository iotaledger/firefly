<script lang="typescript">
    import { DashboardPane } from 'shared/components'
    import { StakingAirdrop as Airdrop } from 'shared/lib/typings/participation'
    import { StakingAirdrop, StakingHeader, StakingInfo, StakingSummary } from './views'
    import { isStakingFeatureNew } from 'shared/lib/participation'
    import { MILLISECONDS_PER_SECOND } from 'shared/lib/time'
    import { showAppNotification } from 'shared/lib/notifications'
    import { localize } from 'shared/lib/i18n'
    import { onMount } from 'svelte'

    const handleNewStakingFeature = (): void => {
        if ($isStakingFeatureNew) {
            showAppNotification({
                type: 'info',
                message: localize('views.staking.welcome')
            })

            isStakingFeatureNew.set(false)
        }
    }

    onMount(async () => {
        if ($isStakingFeatureNew) {
            setTimeout(handleNewStakingFeature, MILLISECONDS_PER_SECOND)
        }
    })
</script>

<style type="text/scss">
    :global(body.platform-win32) .staking-wrapper {
        @apply pt-0;
    }
</style>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    <StakingHeader />
    <div class="w-full h-full grid grid-cols-3 gap-x-4 min-h-0">
        <div class="h-full flex flex-col space-y-3">
            <DashboardPane classes="w-full">
                <StakingSummary />
            </DashboardPane>
            <DashboardPane classes="w-full flex-grow">
                <StakingInfo />
            </DashboardPane>
        </div>
        <DashboardPane classes="h-full">
            <StakingAirdrop airdrop={Airdrop.Assembly} />
        </DashboardPane>
        <DashboardPane classes="h-full">
            <StakingAirdrop airdrop={Airdrop.Shimmer} />
        </DashboardPane>
    </div>
</div>
