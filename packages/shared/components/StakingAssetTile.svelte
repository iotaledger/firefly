<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { isBright } from 'shared/lib/helpers'
    import { localize } from 'shared/lib/i18n'
    import { Asset, Token } from 'shared/lib/typings/assets'
    import {
        getFormattedMinimumRewards,
        getTimeUntilMinimumAirdropReward,
        getUnstakedFunds,
        hasAccountReachedMinimumAirdrop,
        isAccountStaked,
        isStakingPossible,
    } from 'shared/lib/participation/staking'
    import {
        assemblyStakingRemainingTime,
        isPartiallyStaked,
        participationOverview,
        selectedAccountParticipationOverview,
        shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, StakingAirdrop } from 'shared/lib/participation/types'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { openPopup } from 'shared/lib/popup'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'
    import { selectedAccount } from 'shared/lib/wallet'

    export let asset: Asset

    type TooltipText = {
        title: string
        body: string[]
    }

    const airdrop = asset?.name === Token.Assembly ? StakingAirdrop.Assembly : StakingAirdrop.Shimmer

    let isBelowMinimumRewards: boolean
    let showTooltip = false
    let tooltipAnchor: HTMLElement
    let tooltipText: TooltipText
    let remainingTime: number

    $: assetIconColor = isBright(asset?.color) ? 'gray-800' : 'white'
    $: isDarkModeEnabled = $appSettings.darkMode
    $: isActivelyStaking = getAccount($stakedAccounts) && isStakingPossible($stakingEventState)
    $: isPartiallyStakedAndCanStake = $isPartiallyStaked && isStakingPossible($stakingEventState)
    $: hasStakingEnded = $stakingEventState === ParticipationEventState.Ended
    $: $participationOverview, (tooltipText = getLocalizedTooltipText())
    $: remainingTime = asset?.name === Token.Assembly ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime
    $: {
        if (hasAccountReachedMinimumAirdrop($selectedAccount) && !isStakingPossible($stakingEventState)) {
            isBelowMinimumRewards = false
        } else {
            isBelowMinimumRewards = $selectedAccountParticipationOverview?.[`${airdrop}RewardsBelowMinimum`] > 0
        }
    }
    $: showWarningState =
        isPartiallyStakedAndCanStake ||
        (isBelowMinimumRewards && !getAccount($stakedAccounts) && isStakingPossible($stakingEventState)) ||
        (isBelowMinimumRewards && hasStakingEnded)

    function toggleTooltip(): void {
        showTooltip = !showTooltip
    }

    function handleTileClick(): void {
        openPopup({ type: 'airdropNetworkInfo', props: { airdrop } })
    }

    function getAccount(accounts: WalletAccount[]): WalletAccount {
        return accounts?.find((account) => account.alias === $selectedAccount?.alias)
    }

    function getLocalizedTooltipText(): TooltipText {
        if (isPartiallyStakedAndCanStake) {
            return {
                title: localize('tooltips.partiallyStakedFunds.title', {
                    values: { amount: formatUnitBestMatch(getUnstakedFunds($selectedAccount)) },
                }),
                body: [localize('tooltips.partiallyStakedFunds.body')],
            }
        } else if (isBelowMinimumRewards) {
            const minimumRewards = getFormattedMinimumRewards(airdrop)
            if (hasStakingEnded) {
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: [
                        localize('tooltips.stakingMinRewards.bodyDidNotReachMin', {
                            values: {
                                airdrop: capitalize(airdrop),
                                airdropRewardMin: minimumRewards,
                            },
                        }),
                    ],
                }
            } else if (!isAccountStaked($selectedAccount?.id) && isStakingPossible($stakingEventState)) {
                const timeNeeded = getTimeUntilMinimumAirdropReward(airdrop)
                const _getBody = () => {
                    if (timeNeeded) {
                        const body = localize('tooltips.stakingMinRewards.bodyBelowMin', {
                            values: {
                                airdrop: capitalize(airdrop),
                                airdropRewardMin: minimumRewards,
                            },
                        })
                        if (timeNeeded > remainingTime) {
                            return [...body, localize('tooltips.stakingMinRewards.bodyWillNotReachMin')]
                        } else {
                            return [
                                ...body,
                                localize('tooltips.stakingMinRewards.bodyWillReachMin', {
                                    values: { duration: getBestTimeDuration(remainingTime) },
                                }),
                            ]
                        }
                    }
                    return []
                }
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: _getBody(),
                }
            }
        }
    }
</script>

<button
    style="--asset-color: {asset?.color}"
    class="w-full flex flex-row justify-between items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl airdrop"
    class:staked={isActivelyStaking}
    class:partial-stake={showWarningState}
    class:darkmode={isDarkModeEnabled}
    on:click={handleTileClick}
>
    <div class="flex flex-row items-center space-x-4">
        <div class="icon h-8 w-8 rounded-full flex items-center justify-center p-1">
            <Icon classes="text-{assetIconColor}" icon={asset?.name?.toLocaleLowerCase()} height="100%" width="100%" />
        </div>
        <div class="flex flex-col flex-wrap space-y-1">
            <Text classes="font-semibold">{asset?.name}</Text>
            {#if asset?.fiatPrice}
                <Text secondary smaller>{asset?.fiatPrice}</Text>
            {/if}
        </div>
    </div>
    <div class="flex flex-row space-x-2 items-center">
        <div class="flex flex-col flex-wrap space-y-1 text-right">
            <Text classes="font-semibold">{asset?.balance}</Text>
            {#if asset?.fiatBalance}
                <Text secondary smaller>{`≈ ${asset?.fiatBalance}`}</Text>
            {/if}
        </div>
        {#if showWarningState}
            <div bind:this={tooltipAnchor} on:mouseenter={toggleTooltip} on:mouseleave={toggleTooltip}>
                <Icon
                    icon="exclamation"
                    width="16"
                    height="16"
                    classes="mt-0.5 fill-current text-yellow-600 group-hover:text-{assetIconColor}"
                />
            </div>
        {/if}
    </div>
</button>
{#if showTooltip && tooltipText?.body}
    <Tooltip anchor={tooltipAnchor} position="right">
        <Text type="p" classes="text-gray-900 bold mb-2 text-left">{tooltipText?.title}</Text>
        {#each tooltipText?.body as paragraph}
            <Text
                type="p"
                secondary
                classes="text-left {tooltipText?.body.indexOf(paragraph) !== tooltipText?.body.length - 1 && 'mb-2'}"
                >{paragraph}</Text
            >
        {/each}
    </Tooltip>
{/if}

<style type="text/scss">
    .icon {
        background-color: var(--asset-color);
    }
    button {
        &.partial-stake {
            @apply border;
            @apply border-solid;
            @apply border-yellow-600;
            &:hover {
                @apply border-transparent;
            }
            &.darkmode {
                @apply border;
                @apply border-solid;
                @apply border-yellow-600;
                &:hover {
                    @apply border-transparent;
                }
            }
        }
        &.staked:not(.partial-stake) {
            @apply border;
            @apply border-solid;
            @apply border-gray-200;
            &:hover {
                @apply border-transparent;
            }
            &.darkmode {
                @apply border-gray-900;
            }
        }
        &.disabled-hover {
            background-color: var(--account-color);
        }
        &:not(.disabled-hover):hover {
            background-color: var(--account-color);
        }
        &.airdrop {
            @apply opacity-50;
            @apply border;
            @apply border-solid;
            @apply border-gray-200;
            &:not(:hover) {
                @apply bg-transparent;
            }
            &:hover {
                @apply bg-gray-500;
            }
            &.darkmode {
                @apply bg-gray-900;
                @apply border-transparent;
                &:hover {
                    @apply bg-gray-600;
                }
            }
        }
    }
</style>
