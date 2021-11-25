<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import {
        canParticipate,
        partiallyStakedAccounts,
        participationOverview,
        stakedAccounts,
        stakedAmount,
        stakingEventState,
        unstakedAmount,
    } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { ParticipationEventState } from 'shared/lib/typings/participation'
    import { formatUnitBestMatch } from 'shared/lib/units'

    $: participationOverview, $stakedAccounts, $partiallyStakedAccounts

    let canStake

    $: canStake = canParticipate($stakingEventState)
    let isStaked

    $: isStaked = $stakedAmount > 0
    let isPartiallyStaked

    $: isPartiallyStaked = $partiallyStakedAccounts.length > 0

    const handleStakeFundsClick = () => {
        const isUpcoming = $stakingEventState === ParticipationEventState.Upcoming
        const type = !isStaked && isUpcoming ? 'stakingNotice' : 'stakingManager'

        openPopup({ type, hideClose: false })
    }
</script>

<div class="p-5 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" overrideColor classes="mb-2 text-gray-700 text-13 font-normal dark:text-white">
                {localize('views.staking.summary.stakedFunds')}
            </Text>
            {#if isPartiallyStaked}
                <Icon icon="exclamation" classes="fill-current text-yellow-600" />
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">{formatUnitBestMatch($stakedAmount)}</Text>
        <Text type="p" smaller overrideColor classes="mt-1 text-gray-500 dark:text-gray-600">
            {formatUnitBestMatch($unstakedAmount)}
            {localize('general.unstaked')}
        </Text>
    </div>
    <Button
        classes="w-full text-14"
        disabled={!canStake}
        caution={isStaked && isPartiallyStaked}
        secondary={isStaked && !isPartiallyStaked}
        onClick={handleStakeFundsClick}>
        {localize(`actions.${isStaked ? 'manageStake' : 'stakeFunds'}`)}
    </Button>
</div>
