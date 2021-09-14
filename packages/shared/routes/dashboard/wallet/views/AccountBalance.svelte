<script lang="typescript">
    import { BalanceSummary } from 'shared/components'

    export let locale
    export let color
    export let balance
    export let balanceEquiv
    export let onMenuClick
</script>

<div class="relative bg-gradient-to-b from-{color}-500 to-{color}-600 dark:from-gray-800 dark:to-gray-900 pt-6 pb-10 px-8 z-0">
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        <p class="text-11 leading-120 text-white">{locale('general.accountBalance')}</p>
        <BalanceSummary balanceRaw={balance} balanceFiat={balanceEquiv} />
    </div>
    <button
        on:click={() => onMenuClick()}
        class="px-2 py-3 flex flex-row space-x-1 bg-opacity-10 bg-black rounded-lg text-white absolute top-4 right-4">
        {#each Array(3) as _}
            <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" class="fill-current" />
            </svg>
        {/each}
    </button>
</div>
