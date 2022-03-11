<script lang="typescript">
    import { BalanceSummary } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { isBright } from 'shared/lib/helpers'

    export let locale: Locale

    export let color
    export let balance
    export let balanceEquiv
    export let classes = ''

    export let onMenuClick = (): void => {}

    $: textColor = isBright(color) ? 'gray-800' : 'white'
</script>

<div
    style="--account-color: {color};}"
    class="relative account-color dark:from-gray-800 dark:to-gray-900 pt-6 pb-10 px-8 z-0 bg-no-repeat bg-right-top bg-auto {classes}"
>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        <p class="text-11 leading-120 text-{textColor}">{locale('general.accountBalance')}</p>
        <BalanceSummary balanceRaw={balance} balanceFiat={balanceEquiv} {textColor} />
    </div>
    <button
        on:click={() => onMenuClick()}
        class="px-2 py-3 flex flex-row space-x-1 bg-opacity-10 bg-black rounded-lg text-{textColor} absolute top-4 right-4"
    >
        {#each Array(3) as _}
            <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" class="fill-current" />
            </svg>
        {/each}
    </button>
</div>

<style>
    .account-color {
        background-color: var(--account-color);
    }
</style>
