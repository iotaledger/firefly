<script lang="typescript">
    import { get } from 'svelte/store'
    import { Icon, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import {
        formatStakingAirdropReward,
        getMinimumAirdropRewardInfo,
        getStakingEventFromAirdrop,
        getTimeUntilMinimumAirdropReward,
        getUnstakedFunds,
        isStakingPossible,
    } from 'shared/lib/participation'
    import {
        assemblyStakingRemainingTime,
        partiallyStakedAccounts,
        participationOverview,
        shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, ParticipationOverview, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'
    import { wallet } from 'shared/lib/wallet'
    import type { WalletAccount } from 'shared/lib/typings/wallet'

    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = 'turquoise'
    export let ledger = false
    export let airdrop: StakingAirdrop = undefined
    export let size = 'm' // m, l
    export let hidden = false
    export let disabled = false

    export let onClick = (): void | string => ''

    if (airdrop) {
        disabled = true
    }

    const _getAccount = (accounts: WalletAccount[]): WalletAccount => accounts.find((account) => account.alias === name)
    const _hasAccount = (accounts: WalletAccount[]): boolean => _getAccount(accounts) !== undefined

    let isPartiallyStaked = false
    $: isPartiallyStaked = _hasAccount($partiallyStakedAccounts) && isStakingPossible($stakingEventState)

    let isStaked = false
    $: isStaked = _hasAccount($stakedAccounts) && isStakingPossible($stakingEventState)

    let isBelowMinimumStakingRewards
    $: {
        /**
         * NOTE: We are selecting from staked accounts ONLY.
         * Accounts that have been unstaked will NOT have this warning
         * tooltip shown.
         *
         * If we wish to check unstaked accounts also, then we can use the
         * accounts on the wallet Svelte store.
         */
        const account = _getAccount($stakedAccounts)
        if (account) {
            const accountOverview = $participationOverview.find((apo) => apo.accountIndex === account?.index)
            isBelowMinimumStakingRewards =
                accountOverview?.assemblyRewardsBelowMinimum > 0 || accountOverview?.shimmerRewardsBelowMinimum > 0
        }
    }

    let showWarningState = false
    $: showWarningState = isPartiallyStaked || isBelowMinimumStakingRewards

    let showTooltip = false
    let tooltipAnchor

    const toggleTooltip = (): void => {
        showTooltip = !showTooltip
    }

    const getName = (): string => {
        if (name) {
            return name
        } else if (airdrop) {
            switch (airdrop) {
                case StakingAirdrop.Assembly:
                    return 'Assembly'
                case StakingAirdrop.Shimmer:
                    return 'Shimmer'
                default:
                    return ''
            }
        } else {
            return ''
        }
    }

    $: tooltipText = getLocalizedTooltipText($participationOverview)

    const getLocalizedTooltipText = (overview: ParticipationOverview): { title: string; body: string } => {
        if (isPartiallyStaked) {
            return {
                title: localize(
                    `tooltips.partiallyStakedFunds.title${$partiallyStakedAccounts.length > 0 ? '' : 'NoFunds'}`,
                    $partiallyStakedAccounts.length > 0
                        ? {
                              values: {
                                  amount: formatUnitBestMatch(getUnstakedFunds(_getAccount($partiallyStakedAccounts))),
                              },
                          }
                        : {}
                ),
                body: localize('tooltips.partiallyStakedFunds.body'),
            }
        } else if (isBelowMinimumStakingRewards) {
            const account = _getAccount($stakedAccounts)
            const [minRewards, minAirdrop, amountStaked] = getMinimumAirdropRewardInfo(account)
            const airdropRewardMin = formatStakingAirdropReward(
                minAirdrop,
                getStakingEventFromAirdrop(minAirdrop)?.information.payload.requiredMinimumRewards,
                minAirdrop === StakingAirdrop.Assembly ? 6 : 0
            )

            if ($stakingEventState === ParticipationEventState.Ended) {
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: localize(
                        'tooltips.stakingMinRewards.bodyDidNotReachMin',
                        { values: { airdrop: capitalize(airdrop), airdropRewardMin, } }
                    )
                }
            } else {
                const timeNeeded = <number>getTimeUntilMinimumAirdropReward(account)
                const remainingTime =
                    airdrop === StakingAirdrop.Assembly ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime

                if (timeNeeded > remainingTime) {
                    return {
                        title: localize('tooltips.stakingMinRewards.title'),
                        body: `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                            values: { airdrop: capitalize(minAirdrop), airdropRewardMin, },
                        })} ${localize('tooltips.stakingMinRewards.bodyWillNotReachMin')}`,
                    }
                } else {
                    return {
                        title: localize('tooltips.stakingMinRewards.title'),
                        body: `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                            values: { airdrop: capitalize(minAirdrop), airdropRewardMin, },
                        })} ${localize('tooltips.stakingMinRewards.bodyWillReachMin', {
                            values: { duration: getBestTimeDuration(timeNeeded) },
                        })}`,
                    }
                }
            }
        }
    }

    const handleTileClick = (): void => {
        if (airdrop) {
            openPopup({ type: 'airdropNetworkInfo', props: { airdrop } })
        } else {
            onClick()
        }
    }
</script>

<style type="text/scss">
    button {
        height: auto;
        min-height: 100px;
        max-height: 100%;
        &.size-l {
            min-height: 140px;
        }
    }
</style>

<button
    on:click={handleTileClick}
    class="size-{size} group rounded-xl {showWarningState ? 'bg-yellow-100 hover:bg-yellow-400' : `border-gray-100 dark:border-gray-900 hover:bg-${color}-500 ${isStaked ? `border border-1 border-solid border-gray-200 dark:border-gray-900 hover:border-${color}-500` : 'bg-gray-100 dark:bg-gray-900'}`} font-400 flex flex-col justify-between text-left p-{size === 's' ? '3' : '6'} {hidden ? 'opacity-50' : ''} {airdrop ? 'opacity-50 bg-gray-100 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-600' : ''}">
    <div class="mb-2 w-full flex flex-row justify-between items-start space-x-1.5">
        <div class="flex flex-row space-x-1.5 items-start">
            {#if showWarningState}
                <div bind:this={tooltipAnchor} on:mouseenter={toggleTooltip} on:mouseleave={toggleTooltip}>
                    <Icon icon="exclamation" width="16" height="16" classes="mt-0.5 fill-current text-gray-800" />
                </div>
            {:else if isStaked}
                <Icon
                    icon="tokens"
                    width="16"
                    height="16"
                    classes="fill-current mt-0.5 text-gray-800 dark:text-white" />
            {/if}
            <Text
                bold
                smaller={size === 's'}
                overrideColor
                classes="inline text-gray-800 {showWarningState ? '' : 'dark:text-white group-hover:text-white'} overflow-hidden overflow-ellipsis">
                {getName()}
            </Text>
        </div>
        {#if airdrop}
            <Icon
                icon={airdrop}
                classes="fill-current text-gray-{disabled ? '500' : '400'} dark:text-gray-700"
                width={size === 's' ? 13 : 18}
                height={size === 's' ? 13 : 18} />
        {:else if ledger}
            <Icon
                icon="ledger"
                classes="fill-current text-gray-400 dark:text-gray-700"
                width={size === 's' ? 13 : 18}
                height={size === 's' ? 13 : 18} />
        {/if}
    </div>
    <div
        class="flex {size === 'l' ? 'flex-row space-x-4' : 'flex-col space-y-1'} justify-between w-full flex-{size === 'l' ? 'nowrap' : 'wrap'}">
        <Text
            smaller
            overrideColor
            classes="block text-gray-800 {showWarningState ? '' : 'dark:text-white group-hover:text-white'}">
            {#if airdrop}{formatStakingAirdropReward(airdrop, Number(balance), 6)}{:else}{balance}{/if}
        </Text>
        <Text
            smaller
            overrideColor
            classes="block text-blue-500 dark:text-gray-600 {showWarningState ? '' : 'group-hover:text-white'}">
            {balanceEquiv}
        </Text>
    </div>
</button>
{#if showTooltip}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">{tooltipText?.title}</Text>
        <Text type="p" secondary classes="text-left">{tooltipText?.body}</Text>
    </Tooltip>
{/if}
