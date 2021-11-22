<script lang="typescript">
    import { Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts, stakedAmount, unstakedAmount } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { formatUnitBestMatch } from 'shared/lib/units'

    export let locale: Locale

    let isStaked
    $: isStaked = $stakedAmount > 0

    $: {
        console.log('STAKED ACCS: ', $stakedAccounts)
    }

    const handleStakeFundsClick = () => {
        // TODO: Calculate this value instead...
        const isPreStake = true
        const type = !isStaked && isPreStake ? 'stakingNotice' : 'stakingManager'
        const preventClose = type === 'stakingManager'

        openPopup({ type, hideClose: true, preventClose })
    }
</script>

<div class="p-8 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="h-2/6 flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" secondary classes="mb-6">
                Staked funds
            </Text>
            {#if false}
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
        caution={isStaked && false}
        secondary={isStaked && !false}
        onClick={handleStakeFundsClick}
    >
        {isStaked ? 'Manage stake' : 'Stake funds'}
    </Button>
</div>
