<script lang="typescript">
    import { tick } from 'svelte'
    import { Icon, Text, Tooltip } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { STAKING_AIRDROP_TOKENS } from 'shared/lib/participation/constants'
    import { partiallyStakedAccounts, partiallyStakedAmount, stakedAccounts, stakingEventState } from 'shared/lib/participation/stores'
    import { StakingAirdrop } from 'shared/lib/participation/types'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/typings/wallet'
    import { ParticipationEventState} from 'shared/lib/participation/types'

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

    const _hasAccount = (accounts: WalletAccount[]): boolean => accounts.find((account) => account.alias === name) !== undefined

    let stakingHasEnded
    $: stakingHasEnded = $stakingEventState === ParticipationEventState.Ended

    let isPartiallyStaked = false
    $: isPartiallyStaked = _hasAccount($partiallyStakedAccounts) && !stakingHasEnded

    let isStaked = false
    $: isStaked = _hasAccount($stakedAccounts) && !stakingHasEnded

    let showPartialStakeTooltip = false
    let iconBox
    let parentWidth = 0
    let parentLeft = 0
    let parentTop = 0

    $: iconBox, showPartialStakeTooltip, void refreshIconBox()

    const refreshIconBox = async (): Promise<void> => {
        if (!iconBox || !showPartialStakeTooltip) return

        await tick()

        parentWidth = iconBox?.offsetWidth / 2 ?? 0
        parentLeft = iconBox?.getBoundingClientRect().left ?? 0

        /**
         * CAUTION: The top requires a specific multiplier that
         * does seem to play nicely with responsiveness.
         */
        const top = iconBox?.getBoundingClientRect().top ?? 0
        parentTop = top * 1.15
    }

    const togglePartialStakeTooltip = (): void => {
        showPartialStakeTooltip = !showPartialStakeTooltip
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

    const handleTileClick = (): void => {
        onClick()
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
        &:disabled {
            @apply pointer-events-none;
            @apply opacity-50;
        }
    }
</style>

<button
    on:click={handleTileClick}
    class="size-{size} group rounded-xl {isStaked ? 'bg-yellow-100 hover:bg-yellow-400' : `bg-gray-100 dark:bg-gray-900 hover:bg-${color}-500`} font-400 flex flex-col justify-between text-left p-{size === 's' ? '3' : '6'} {hidden ? 'opacity-50' : ''}"
    {disabled}
>
    <div class="mb-2 w-full flex flex-row justify-between items-start space-x-1.5">
        <div class="flex flex-row space-x-1.5 items-start">
            {#if isPartiallyStaked}
                <div
                    bind:this={iconBox}
                    on:mouseenter={togglePartialStakeTooltip}
                    on:mouseleave={togglePartialStakeTooltip}>
                    <Icon icon="exclamation" width="16" height="16" classes="mt-0.5 fill-current text-gray-800" />
                </div>
            {:else if isStaked}
                <Icon icon="tokens" width="16" height="16" classes="mt-0.5 fill-current text-gray-800" />
            {/if}
            <Text
                bold
                smaller={size === 's'}
                overrideColor
                classes="inline text-gray-800 {isStaked ? '' : 'dark:text-white group-hover:text-white'} overflow-hidden overflow-ellipsis">
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
        class="flex {size === 'l' ? 'flex-row space-x-4' : 'flex-col space-y-1'} justify-between w-full flex-{size === 'l' ? 'nowrap' : 'wrap'}"
    >
        <Text smaller overrideColor classes="block text-gray-800 {isStaked ? '' : 'dark:text-white group-hover:text-white'}">
            {balance}
            {#if airdrop}
                {STAKING_AIRDROP_TOKENS[airdrop.toLowerCase()]}
            {/if}
        </Text>
        <Text smaller overrideColor classes="block text-blue-500 dark:text-gray-600 {isStaked ? '' : 'group-hover:text-white'}">
            {balanceEquiv}
        </Text>
    </div>
</button>
{#if showPartialStakeTooltip}
    <Tooltip {parentTop} {parentLeft} {parentWidth} position="right">
        <Text type="p" classes="text-gray-900 bold mb-1 text-left">
            {localize(
                `tooltips.partiallyStakedFunds.title${$partiallyStakedAmount !== undefined ? '' : 'NoFunds'}`,
                $partiallyStakedAmount !== undefined
                    ? { values: { amount: formatUnitBestMatch($partiallyStakedAmount) } }
                    : { }
            )}
        </Text>
        <Text type="p" secondary classes="text-left">
            {localize('tooltips.partiallyStakedFunds.body')}
        </Text>
    </Tooltip>
{/if}
