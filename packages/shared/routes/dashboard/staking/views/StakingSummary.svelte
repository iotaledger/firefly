<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import {
        canParticipate,
        partiallyStakedAccounts, participationOverview,
        stakedAmount,
        stakingEventState,
        unstakedAmount
    } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { ParticipationEventState } from 'shared/lib/typings/participation'

    export let locale: Locale

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

<div class="p-8 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="h-2/6 flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" secondary classes="mb-6">
                Staked funds
            </Text>
            {#if isPartiallyStaked}
                <Icon icon="exclamation" classes="fill-current text-yellow-600" />
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">
            {formatUnitBestMatch($stakedAmount)}
        </Text>
        <Text type="p" secondary>
            {formatUnitBestMatch($unstakedAmount)}
            Unstaked
        </Text>
    </div>
    <Button
        classes="w-full"
        disabled={!canStake}
        caution={isStaked && isPartiallyStaked}
        secondary={isStaked && !isPartiallyStaked}
        onClick={handleStakeFundsClick}
    >
        {isStaked ? 'Manage stake' : 'Stake funds'}
    </Button>
</div>
