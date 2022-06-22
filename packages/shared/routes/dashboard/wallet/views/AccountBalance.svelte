<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { accountRoute, accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccount } from 'shared/lib/wallet'

    export let classes = ''

    export let onMenuClick = (): void => {}

    let showPreciseBalance = false

    function handleSendClick() {
        $accountRouter.goTo(AccountRoute.Send)
    }
    function handleReceiveClick() {
        $accountRouter.goTo(AccountRoute.Receive)
    }

    function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
    }
</script>

<div
    class="bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative p-6 {$mobile
        ? 'pb-0 pt-20 bg-transparent'
        : 'pb-12'} {classes}"
>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        {#if !$mobile}
            <p class="text-11 leading-120 text-gray-800 dark:text-white uppercase tracking-widest">
                {localize('general.balance')}
            </p>
        {/if}
        <div class="flex flex-col flex-wrap {$mobile ? 'items-center' : 'items-start space-y-1.5 mr-12'}">
            <div on:click={togglePreciseBalance}>
                <Text type={$mobile ? 'h1' : 'h2'}>
                    {showPreciseBalance
                        ? formatUnitPrecision($selectedAccount?.rawIotaBalance, Unit.Mi)
                        : formatUnitBestMatch($selectedAccount?.rawIotaBalance, true, 3)}
                </Text>
            </div>
            <Text type={$mobile ? 'h4' : 'p'} smaller overrideColor={$mobile} classes={mobile && 'text-gray-500'}>
                {$selectedAccount?.balanceEquiv}
            </Text>
        </div>
    </div>
    {#if $accountRoute === AccountRoute.Init || $mobile}
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4 mt-7 {$mobile && 'mb-10'}">
            <button
                class="action p-3 w-full text-center rounded-lg font-semibold text-14 bg-blue-500 text-white"
                on:click={handleReceiveClick}
            >
                {localize('actions.receive')}
            </button>
            <button
                class="action p-3 w-full text-center rounded-lg font-semibold text-14 bg-blue-500 text-white"
                on:click={handleSendClick}
            >
                {localize('actions.send')}
            </button>
        </div>
    {/if}
    {#if !mobile}
        <button
            on:click={() => onMenuClick()}
            class="{$mobile
                ? 'menu-mobile'
                : 'bg-opacity-10 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg'} px-2 py-3 flex flex-row space-x-1 text-gray-900 dark:text-white absolute top-6 right-6"
        >
            {#each Array(3) as _}
                <svg width="4" height="4" viewBox="0 0 4 4">
                    <circle cx="2" cy="2" r="2" class="fill-current" />
                </svg>
            {/each}
        </button>
    {/if}
</div>

<style type="text/scss">
    .menu-mobile {
        position: absolute;
        margin-top: -8px;
        right: 25px;
    }
</style>
