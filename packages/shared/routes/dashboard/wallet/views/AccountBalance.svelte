<script lang="typescript">
    import { Text } from 'shared/components'

    export let locale
    export let color
    export let balance
    export let balanceEquiv
    export let onMenuClick
</script>

<div class="bg-gradient-to-b from-{color}-500 to-{color}-600 dark:from-gray-800 dark:to-gray-900 pt-4 pb-10 px-8">
    <!-- Balance -->
    <div data-label="total-balance">
        <div class="flex flex-row justify-between items-center mb-2">
            <Text type="p" overrideColor smaller classes="text-white">{locale('general.accountBalance')}</Text>
            <button
                on:click={() => onMenuClick()}
                class="px-2 py-3 flex flex-row space-x-1 bg-opacity-10 bg-black rounded-lg text-white">
                {#each Array(3) as _}
                    <svg width="4" height="4" viewBox="0 0 4 4">
                        <circle cx="2" cy="2" r="2" class="fill-current" />
                    </svg>
                {/each}
            </button>
        </div>
        <Text type="h2" overrideColor classes="text-white mb-2">{balance}</Text>
        <Text type="p" overrideColor smaller classes="text-white dar:text-blue-300 text-opacity-70 ">{balanceEquiv}</Text>
    </div>
</div>
