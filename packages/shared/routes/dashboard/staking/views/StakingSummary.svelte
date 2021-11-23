<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAmount, unstakedAmount } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'

    export let locale: Locale

    let isStaked
    $: isStaked = $stakedAmount > 0

    const handleStakeFundsClick = () => {
        // TODO: Calculate this value instead...
        const isPreStake = true
        const type = !isStaked && isPreStake ? 'stakingNotice' : 'stakingManager'
        const preventClose = type === 'stakingManager'

        openPopup({ type, hideClose: true, preventClose })
    }
</script>

<div class="p-5 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" overrideColor classes="mb-2 text-gray-700 text-13 font-normal">
                {locale('views.staking.summary.stakedFunds')}
            </Text>
            {#if false}
                <Icon icon="exclamation" classes="fill-current text-yellow-600" />
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">{formatUnitBestMatch($stakedAmount)}</Text>
        <Text type="p" smaller overrideColor classes="mt-1 text-gray-500">
            {formatUnitBestMatch($unstakedAmount)}
            {locale('views.staking.summary.unstaked')}
        </Text>
    </div>
    <Button
        small
        classes="w-full text-14"
        caution={isStaked && false}
        secondary={isStaked && !false}
        onClick={handleStakeFundsClick}>
        {isStaked ?  locale('views.staking.summary.manageStake') :  locale('views.staking.summary.stakeFunds')}
    </Button>
</div>
