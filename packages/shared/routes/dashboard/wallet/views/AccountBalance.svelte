<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { isBright } from 'shared/lib/helpers'
    import { localize } from '@core/i18n'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { accountRoute, accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccount } from 'shared/lib/wallet'

    export let classes = ''

    export let onMenuClick = (): void => {}

    $: color = getColor($activeProfile, $selectedAccount?.id) as string
    $: textColor = isBright(color) ? 'gray-800' : 'white'

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
    style="--account-color: {color};"
    class="relative account-color p-8 {$mobile ? 'pb-0 bg-transparent' : 'pb-12'} {classes}"
>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        {#if !$mobile}
            <p class="text-11 leading-120 text-{textColor} uppercase tracking-widest">{localize('general.balance')}</p>
        {/if}
        <div class="flex flex-col flex-wrap items-start space-y-1.5">
            <div on:click={togglePreciseBalance}>
                <Text type="h2" overrideColor classes="text-{textColor}">
                    {showPreciseBalance
                        ? formatUnitPrecision($selectedAccount?.rawIotaBalance, Unit.Mi)
                        : formatUnitBestMatch($selectedAccount?.rawIotaBalance, true, 3)}
                </Text>
            </div>
            <Text type="p" overrideColor smaller classes="text-{textColor} dark:text-{textColor}">
                {$selectedAccount?.balanceEquiv}
            </Text>
        </div>
    </div>
    {#if $accountRoute === AccountRoute.Init || $mobile}
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4 mt-7">
            <button
                class="action p-3 w-full text-center rounded-lg font-semibold text-14 bg-{textColor}"
                on:click={handleReceiveClick}
            >
                {localize('actions.receive')}
            </button>
            <button
                class="action p-3 w-full text-center rounded-lg font-semibold text-14 bg-{textColor}"
                on:click={handleSendClick}
            >
                {localize('actions.send')}
            </button>
        </div>
    {/if}
    <button
        on:click={() => onMenuClick()}
        class="px-2 py-3 m-4 flex flex-row space-x-1 bg-opacity-10 bg-black rounded-lg text-{textColor} absolute top-4 right-4"
    >
        {#each Array(3) as _}
            <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" class="fill-current" />
            </svg>
        {/each}
    </button>
</div>

<style type="text/scss">
    .account-color {
        background-color: var(--account-color);
        button.action {
            color: var(--account-color);
        }
    }
</style>
