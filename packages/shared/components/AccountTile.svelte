<script lang="typescript">
    import { Icon, Text, Tooltip } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { localize } from 'shared/lib/i18n'
    import {
        formatStakingAirdropReward,
        getFormattedMinimumRewards,
        getTimeUntilMinimumAirdropReward,
        getUnstakedFunds,
        hasAccountReachedMinimumAirdrop,
        isAccountStaked,
        isStakingPossible,
    } from 'shared/lib/participation/staking'
    import {
        assemblyStakingRemainingTime,
        partiallyStakedAccounts,
        participationOverview,
        shimmerStakingRemainingTime,
        stakedAccounts,
        stakingEventState,
    } from 'shared/lib/participation/stores'
    import { ParticipationEventState, StakingAirdrop } from 'shared/lib/participation/types'
    import { openPopup } from 'shared/lib/popup'
    import { getBestTimeDuration } from 'shared/lib/time'
    import { WalletAccount } from 'shared/lib/typings/wallet'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { capitalize } from 'shared/lib/utils'
    import { wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { isBright } from 'shared/lib/helpers'

    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = ''
    export let airdrop: StakingAirdrop = undefined
    export let size = 'm' // m, l
    export let hidden = false
    export let disabled = false
    export let classes = ''
    export let onClick = (): void | string => ''
    export let disabledHover = false

    $: darkModeEnabled = $appSettings.darkMode

    $: textColor = isBright(color) ? 'gray-800' : 'white'

    if (airdrop) {
        disabled = true
    }

    const _getAccount = (accounts: WalletAccount[]): WalletAccount => accounts.find((account) => account.alias === name)
    const _hasAccount = (accounts: WalletAccount[]): boolean => _getAccount(accounts) !== undefined

    $: isPartiallyStaked = _hasAccount($partiallyStakedAccounts) && isStakingPossible($stakingEventState)
    $: isActivelyStaking = _hasAccount($stakedAccounts) && isStakingPossible($stakingEventState)
    $: isStakingEnded = $stakingEventState === ParticipationEventState.Ended

    let isBelowMinimumStakingRewards: boolean
    let isBelowMinimumAssemblyRewards: boolean
    let isBelowMinimumShimmerRewards: boolean

    $: {
        const { accounts } = get(wallet)
        const account = _getAccount(get(accounts))

        if (hasAccountReachedMinimumAirdrop(account) && !isStakingPossible($stakingEventState)) {
            isBelowMinimumStakingRewards = false
        } else {
            const accountOverview = $participationOverview.find((apo) => apo.accountIndex === account?.index)
            isBelowMinimumStakingRewards =
                accountOverview?.assemblyRewardsBelowMinimum > 0 || accountOverview?.shimmerRewardsBelowMinimum > 0
            isBelowMinimumAssemblyRewards = accountOverview?.assemblyRewardsBelowMinimum > 0
            isBelowMinimumShimmerRewards = accountOverview?.shimmerRewardsBelowMinimum > 0
        }
    }

    $: showWarningState =
        isPartiallyStaked ||
        (isBelowMinimumStakingRewards && !_hasAccount($stakedAccounts) && isStakingPossible($stakingEventState)) ||
        (isBelowMinimumStakingRewards && isStakingEnded)

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

    let tooltipText
    $: $participationOverview, (tooltipText = getLocalizedTooltipText())

    const getLocalizedTooltipText = (): { title: string; body: string[] } => {
        const { accounts } = get(wallet)
        const account = _getAccount(get(accounts))

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
                body: [localize('tooltips.partiallyStakedFunds.body')],
            }
        } else if (isBelowMinimumStakingRewards) {
            const shimmerMinimumRewards = getFormattedMinimumRewards(StakingAirdrop.Shimmer)
            const assemblyMinimumRewards = getFormattedMinimumRewards(StakingAirdrop.Assembly)

            if ($stakingEventState === ParticipationEventState.Ended) {
                const _getBody = () => {
                    const body = []
                    if (isBelowMinimumAssemblyRewards) {
                        body.push(
                            `${localize('tooltips.stakingMinRewards.bodyDidNotReachMin', {
                                values: {
                                    airdrop: capitalize(StakingAirdrop.Assembly),
                                    airdropRewardMin: assemblyMinimumRewards,
                                },
                            })}`
                        )
                    }
                    if (isBelowMinimumShimmerRewards) {
                        body.push(
                            `${localize('tooltips.stakingMinRewards.bodyDidNotReachMin', {
                                values: {
                                    airdrop: capitalize(StakingAirdrop.Shimmer),
                                    airdropRewardMin: shimmerMinimumRewards,
                                },
                            })}`
                        )
                    }
                    return body
                }
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: _getBody(),
                }
            } else if (!isAccountStaked(account?.id) && isStakingPossible($stakingEventState)) {
                const timeNeededAssembly = <number>getTimeUntilMinimumAirdropReward(account, StakingAirdrop.Assembly)
                const timeNeededShimmer = <number>getTimeUntilMinimumAirdropReward(account, StakingAirdrop.Shimmer)
                const remainingTime =
                    airdrop === StakingAirdrop.Assembly ? $assemblyStakingRemainingTime : $shimmerStakingRemainingTime
                const _getBody = () => {
                    const body = []
                    if (isBelowMinimumAssemblyRewards) {
                        if (timeNeededAssembly > remainingTime) {
                            body.push(
                                `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                                    values: {
                                        airdrop: capitalize(StakingAirdrop.Assembly),
                                        airdropRewardMin: assemblyMinimumRewards,
                                    },
                                })} ${localize('tooltips.stakingMinRewards.bodyWillNotReachMin')}`
                            )
                        } else if (timeNeededAssembly > 0) {
                            body.push(
                                `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                                    values: {
                                        airdrop: capitalize(StakingAirdrop.Assembly),
                                        airdropRewardMin: assemblyMinimumRewards,
                                    },
                                })} ${localize('tooltips.stakingMinRewards.bodyWillReachMin', {
                                    values: { duration: getBestTimeDuration(timeNeededAssembly) },
                                })}`
                            )
                        }
                    }
                    if (isBelowMinimumShimmerRewards) {
                        if (timeNeededShimmer > remainingTime) {
                            body.push(
                                `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                                    values: {
                                        airdrop: capitalize(StakingAirdrop.Shimmer),
                                        airdropRewardMin: shimmerMinimumRewards,
                                    },
                                })} ${localize('tooltips.stakingMinRewards.bodyWillNotReachMin')}`
                            )
                        } else if (timeNeededShimmer > 0) {
                            body.push(
                                `${localize('tooltips.stakingMinRewards.bodyBelowMin', {
                                    values: {
                                        airdrop: capitalize(StakingAirdrop.Shimmer),
                                        airdropRewardMin: shimmerMinimumRewards,
                                    },
                                })} ${localize('tooltips.stakingMinRewards.bodyWillReachMin', {
                                    values: { duration: getBestTimeDuration(timeNeededShimmer) },
                                })}`
                            )
                        }
                    }
                    return body
                }
                return {
                    title: localize('tooltips.stakingMinRewards.title'),
                    body: _getBody(),
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

    let showStyles = false

    const toggleStyles = (): void => {
        showStyles = !showStyles
    }
</script>

<button
    on:click={handleTileClick}
    on:mouseenter={toggleStyles}
    on:mouseleave={toggleStyles}
    class="{classes} {disabledHover
        ? 'disabled-hover'
        : 'bg-gray-100 dark:bg-gray-900'} size-{size} group rounded-xl font-400 flex flex-col justify-between text-left p-{size ===
    's'
        ? '3'
        : '6'} bg-no-repeat bg-right-top bg-auto"
    class:staked={isActivelyStaking}
    class:partial-stake={showWarningState}
    class:airdrop
    class:hidden-wallet={hidden}
    class:darkmode={darkModeEnabled}
    style="--account-color: {color};"
    {disabled}
>
    <div class="mb-2 w-full flex flex-row justify-between items-start space-x-1.5">
        <div class="flex flex-row space-x-1.5 items-start w-full whitespace-nowrap">
            {#if showWarningState}
                <div bind:this={tooltipAnchor} on:mouseenter={toggleTooltip} on:mouseleave={toggleTooltip}>
                    <Icon
                        icon="exclamation"
                        width="16"
                        height="16"
                        classes="mt-0.5 fill-current text-yellow-600 group-hover:text-{textColor}"
                    />
                </div>
            {:else if isActivelyStaking}
                <Icon
                    icon="tokens"
                    width="16"
                    height="16"
                    classes="fill-current mt-0.5 {disabledHover
                        ? `text-${textColor}`
                        : `text-gray-800 dark:text-white group-hover:text-{textColor}`}"
                />
            {/if}
            <Text
                bold
                smaller={size === 's'}
                overrideColor
                classes="inline text-gray-800 {disabledHover
                    ? `text-${textColor}`
                    : `text-gray-800 dark:text-white group-hover:text-${textColor}`} overflow-hidden overflow-ellipsis"
            >
                {getName()}
            </Text>
        </div>
        {#if airdrop}
            <Icon
                icon={airdrop}
                classes="fill-current text-gray-{disabled ? '500' : '400'} dark:text-gray-700 group-hover:text-white"
                width={size === 's' ? 13 : 18}
                height={size === 's' ? 13 : 18}
            />
        {/if}
    </div>
    <div
        class="flex {size === 'l' ? 'flex-row space-x-4' : 'flex-col space-y-1'} justify-between w-full flex-{size ===
        'l'
            ? 'nowrap'
            : 'wrap'}"
    >
        <Text
            smaller
            overrideColor
            classes="block {disabledHover
                ? `text-${textColor}`
                : `text-gray-800 dark:text-white group-hover:text-${textColor}`}"
        >
            {#if airdrop}{formatStakingAirdropReward(airdrop, Number(balance), 6)}{:else}{balance}{/if}
        </Text>
        <Text
            smaller
            overrideColor
            classes="block {disabledHover
                ? `text-${textColor}`
                : `text-blue-500 dark:text-gray-600 group-hover:text-${textColor}`}"
        >
            {balanceEquiv}
        </Text>
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
    button {
        height: auto;
        min-height: 110px;
        max-height: 100%;
        &.size-l {
            min-height: 140px;
        }
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
        &.hidden-wallet {
            @apply opacity-50;
        }
    }
</style>
