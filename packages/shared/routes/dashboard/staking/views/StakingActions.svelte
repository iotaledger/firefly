<script lang="typescript">
    import { Button, StakingIndicator, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts, stakingEventStatus } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { StakingEventStatus } from 'shared/lib/typings/participation'

    export let locale: Locale

    stakedAccounts.set([])

    $: hasStakedAccounts = $stakedAccounts.length !== 0

    // TODO: Remove later once polling handles automatically updating the stake
    stakingEventStatus.set(StakingEventStatus.PreStake)

    const handleStakeFundsClick = () => {
        const isPreStake = $stakingEventStatus === StakingEventStatus.PreStake
        const type = !hasStakedAccounts && isPreStake ? 'stakingNotice' : 'stakingSelection'

        openPopup({ type, hideClose: true })
    }
</script>

<div class="p-8 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-row justify-between">
        <Text type="h5" classes="text-2xl">{locale('views.staking.title')}</Text>
        <StakingIndicator fundsStaked={true} />
    </div>
    <div class="h-2/6">
        <Text type="h5" classes="text-3xl">
            7.38 Gi
        </Text>
        <Text type="p" secondary>
            {locale('views.staking.manager.availableForStaking')}
        </Text>
    </div>
    {#if hasStakedAccounts}
        <Button classes="w-full" secondary onClick={handleStakeFundsClick}>
            Manage stake
        </Button>
    {:else}
        <Button classes="w-full" onClick={handleStakeFundsClick}>
            {locale('actions.stakeFunds')}
        </Button>
    {/if}
</div>
