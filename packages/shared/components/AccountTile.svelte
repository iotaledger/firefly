<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { STAKING_AIRDROP_TOKENS } from 'shared/lib/participation'
    import { StakingAirdrop } from 'shared/lib/typings/participation'

    export let name = ''
    export let balance = ''
    export let balanceEquiv = ''
    export let color = 'turquoise'
    export let ledger = false
    export let airdrop: StakingAirdrop = undefined
    export let staked = false
    export let size = 'm' // m, l
    export let hidden = false
    export let disabled = false

    export let onClick = (): void | string => ''

    if (airdrop) {
        disabled = true
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
    on:click={staked ? () => {} : onClick}
    class="size-{size} group rounded-xl {staked ? 'bg-yellow-50 cursor-default' : `bg-gray-100 dark:bg-gray-900 hover:bg-${color}-500`} font-400 flex flex-col justify-between text-left p-{size === 's' ? '3' : '6'} {hidden ? 'opacity-50' : ''}"
    {disabled}
>
    <div class="mb-2 w-full flex flex-row justify-between items-start space-x-1.5">
        <Text
            bold
            smaller={size === 's'}
            overrideColor
            classes="text-gray-800 dark:text-white {staked ? '' : 'group-hover:text-white'} overflow-hidden overflow-ellipsis"
        >
            {getName()}
        </Text>
        {#if staked}
            <Icon icon="lock" width="18" height="18" classes="fill-current text-gray-500" />
        {:else if airdrop}
            <Icon icon={airdrop} classes="fill-current text-gray-600" />
        {:else if ledger}
            <Icon
                icon="ledger"
                classes="text-gray-400 dark:text-gray-700"
                width={size === 's' ? 13 : 21}
                height={size === 's' ? 13 : 21} />
        {/if}
    </div>
    <div
        class="flex {size === 'l' ? 'flex-row space-x-4' : 'flex-col space-y-1'} justify-between w-full flex-{size === 'l' ? 'nowrap' : 'wrap'}">
        <Text smaller overrideColor classes="block text-gray-800 dark:text-white {staked ? '' : 'group-hover:text-white'}">
            {balance}
            {#if airdrop}
                {STAKING_AIRDROP_TOKENS[airdrop.toLowerCase()]}
            {/if}
        </Text>
        <Text smaller overrideColor classes="block text-blue-500 dark:text-gray-600 {staked ? '' : 'group-hover:text-white'}">
            {balanceEquiv}
        </Text>
    </div>
</button>
