<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { isBright } from 'shared/lib/helpers'
    import { localize } from 'shared/lib/i18n'
    import { activeProfile, getColor } from 'shared/lib/profile'
    import { accountRoute } from 'shared/lib/router'
    import { AccountRoutes } from 'shared/lib/typings/routes'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccount } from 'shared/lib/wallet'

    export let classes = ''

    export let onMenuClick = (): void => {}

    $: color = getColor($activeProfile, $selectedAccount?.id) as string
    $: textColor = isBright(color) ? 'gray-800' : 'white'

    let showPreciseBalance = false

    function handleSendClick() {
        accountRoute.set(AccountRoutes.Send)
    }
    function handleReceiveClick() {
        accountRoute.set(AccountRoutes.Receive)
    }

    function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
    }
</script>

<div
    style="--account-color: {color};"
    class="relative account-color p-6 {$mobile ? 'pt-6 pb-9 bg-transparent' : 'pb-12'} {classes}"
>
    <!-- Balance -->
    <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
        {#if !$mobile}
            <p class="text-11 leading-120 text-{textColor} uppercase tracking-widest">{localize('general.balance')}</p>
        {/if}
        <div class="{$mobile ? 'items-center' : 'space-y-1.5'} flex flex-col flex-wrap items-start w-full">
            <div on:click={togglePreciseBalance}>
                <Text type={$mobile ? 'h1' : 'h2'} overrideColor classes="text-{textColor}">
                    {showPreciseBalance
                        ? formatUnitPrecision($selectedAccount?.rawIotaBalance, Unit.Mi)
                        : formatUnitBestMatch($selectedAccount?.rawIotaBalance, true, 3)}
                </Text>
            </div>
            <Text type={$mobile ? 'h4' : 'p'} overrideColor smaller classes="text-{textColor} dark:text-{textColor}">
                {$selectedAccount?.balanceEquiv}
            </Text>
        </div>
    </div>
    {#if $accountRoute === AccountRoutes.Init || $mobile}
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4 mt-7">
            <button
                class="{$mobile
                    ? `text-${textColor} bg-none border border-${textColor} border-solid rounded-xl text-16 py-2 px-3`
                    : `bg-${textColor} action text-14 p-3`}  w-full text-center rounded-lg font-semibold "
                on:click={handleSendClick}
            >
                {localize('actions.send')}
            </button>
            <button
                class="{$mobile
                    ? `text-${textColor} bg-none border border-${textColor} border-solid rounded-xl text-16 py-2 px-3`
                    : `bg-${textColor} action text-14 p-3`}  w-full text-center rounded-lg font-semibold "
                on:click={handleReceiveClick}
            >
                {localize('actions.receive')}
            </button>
        </div>
    {/if}
    <button
        on:click={() => onMenuClick()}
        class="{$mobile
            ? '-top-8'
            : 'bg-opacity-10 bg-black rounded-lg top-4'} px-2 py-3 flex flex-row space-x-1 text-{textColor} absolute right-4 "
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
