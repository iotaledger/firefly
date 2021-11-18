<script lang="typescript">
    import { BalanceSummary, Button, Icon, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { hasPartiallyStakedFunds, stakedAccounts, stakingEventStatus } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { StakingEventStatus } from 'shared/lib/typings/participation'
    import { wallet } from '../../../../lib/wallet'
    import { get } from 'svelte/store'
    import { formatUnitBestMatch } from '../../../../lib/units'
    import { WalletAccount } from '../../../../lib/typings/wallet'

    export let locale: Locale

    let hasStakedAccounts
    $: hasStakedAccounts = $stakedAccounts.length !== 0
    $: unstakedAccounts = get($wallet.accounts).filter((a) => !$stakedAccounts.map((sa) => sa.id).includes(a.id))

    // TODO: Remove later once polling handles automatically updating the stake
    stakingEventStatus.set(StakingEventStatus.PreStake)

    const sumRawAccountBalances = (accounts: WalletAccount[]): number =>
        accounts.map((a) => a.rawIotaBalance).reduce((amt, cur) => amt + cur, 0)

    const calculateBalanceFromAccounts = (accounts: WalletAccount[]): string =>
        formatUnitBestMatch(accounts.map((a) => a.rawIotaBalance).reduce((amt, cur) => amt + cur, 0))

    const handleStakeFundsClick = () => {
        const isPreStake = $stakingEventStatus === StakingEventStatus.PreStake
        const type = !hasStakedAccounts && isPreStake ? 'stakingNotice' : 'stakingSelection'

        openPopup({ type, hideClose: true })
    }
</script>

<div class="p-8 flex flex-col justify-between space-y-6 w-full h-full">
    <div class="h-2/6 flex flex-col justify-between">
        <div class="flex flex-row justify-between items-start">
            <Text type="p" secondary classes="mb-6">
                Staked funds
            </Text>
            {#if $hasPartiallyStakedFunds && hasStakedAccounts}
                <Icon icon="exclamation" classes="fill-current text-yellow-600" />
            {/if}
        </div>
        <Text type="h5" classes="text-3xl">
            {calculateBalanceFromAccounts($stakedAccounts)}
        </Text>
        <Text type="p" secondary>
            {calculateBalanceFromAccounts(unstakedAccounts)}
            Unstaked
        </Text>
    </div>
    <Button
        classes="w-full"
        caution={hasStakedAccounts && $hasPartiallyStakedFunds}
        secondary={hasStakedAccounts && !$hasPartiallyStakedFunds}
        onClick={handleStakeFundsClick}
    >
        {hasStakedAccounts ? 'Manage stake' : 'Stake funds'}
    </Button>
</div>
