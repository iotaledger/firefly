<script lang="typescript">
    import { BalanceSummary, Button, StakingIndicator, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { stakedAccounts, stakingEventStatus } from 'shared/lib/participation'
    import { openPopup } from 'shared/lib/popup'
    import { StakingEventStatus } from 'shared/lib/typings/participation'
    import { wallet } from '../../../../lib/wallet'
    import { get } from 'svelte/store'
    import { formatUnitBestMatch } from '../../../../lib/units'
    import { WalletAccount } from '../../../../lib/typings/wallet'

    export let locale: Locale

    $: hasStakedAccounts = $stakedAccounts.length !== 0

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
    <div class="flex flex-row justify-between">
        <Text type="h5" classes="text-2xl">{locale('views.staking.title')}</Text>
        <StakingIndicator fundsStaked={true} />
    </div>
    {#if hasStakedAccounts}
        <div class="h-2/6">
            <Text type="h5" classes="text-3xl">
                {calculateBalanceFromAccounts($stakedAccounts)}
            </Text>
<!--            <BalanceSummary balanceRaw={sumRawAccountBalances($stakedAccounts)} />-->
            <Text type="p" secondary>
                Staked funds
            </Text>
        </div>
        <Button classes="w-full" secondary onClick={handleStakeFundsClick}>
            Manage stake
        </Button>
    {:else}
        <div class="h-2/6">
            <Text type="h5" classes="text-3xl">
                {calculateBalanceFromAccounts(get($wallet.accounts))}
            </Text>
            <Text type="p" secondary>
                Available for staking
            </Text>
        </div>
        <Button classes="w-full" onClick={handleStakeFundsClick}>
            Stake funds
        </Button>
    {/if}
</div>
