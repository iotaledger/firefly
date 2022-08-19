<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { ButtonMobile, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { accountRoute, accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { spring } from 'svelte/motion'
    import { selectedAccountStore } from 'shared/lib/wallet'

    export let classes = ''
    export let scale = spring(1)
    export let onMenuClick = (): void => {}

    let background: HTMLElement
    let balance: HTMLElement
    let conversion: HTMLElement
    let buttons: HTMLElement

    let showPreciseBalance = false

    function handleSendClick() {
        $accountRouter.goTo(AccountRoute.Send)
    }
    function handleReceiveClick() {
        $accountRouter.goTo(AccountRoute.Receive)
    }

    function getScale(factor: number): string {
        return `scale(${factor}, ${factor})`
    }

    function getTranslation(y: number) {
        return `translateY(${y}px)`
    }

    function scrollAnimation(curr: number): void {
        if (!background || !conversion || !buttons || !window) return

        background.style.transform = getTranslation(-background.clientHeight * 0.6 * (1 - curr))

        transformBalance(curr)
        conversion.style.transform = getTranslation(background.clientHeight * (1 - curr))
        buttons.style.transform = getTranslation(background.clientHeight * (1 - curr))
    }

    function transformBalance(curr: number): void {
        if (!balance || !window) return

        const scale = getScale(0.4 * curr + 0.6)
        const translate = getTranslation(background.clientHeight * 0.8 * (1 - curr))

        balance.style.transform = `${scale} ${translate}`
    }

    $: scrollAnimation($scale)

    function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
    }
</script>

{#if $mobile}
    <div
        class="safe-area bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative px-5 pb-0 bg-transparent {classes}"
        bind:this={background}
    >
        <!-- Balance -->
        <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
            <div class="flex flex-col flex-wrap items-center">
                <div on:click={togglePreciseBalance} bind:this={balance}>
                    <Text type="h1">
                        {showPreciseBalance
                            ? formatUnitPrecision($selectedAccountStore?.rawIotaBalance, Unit.Mi)
                            : formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3)}
                    </Text>
                </div>
                <div bind:this={conversion}>
                    <Text type="h4" smaller overrideColor classes="text-gray-500">
                        {$selectedAccountStore?.balanceEquiv}
                    </Text>
                </div>
            </div>
        </div>
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4 mt-7 mb-10" bind:this={buttons}>
            <ButtonMobile textBig classes="w-full font-semibold" onClick={handleSendClick}>
                {localize('actions.send')}
            </ButtonMobile>
            <ButtonMobile textBig classes="w-full font-semibold" onClick={handleReceiveClick}>
                {localize('actions.receive')}
            </ButtonMobile>
        </div>
    </div>
{:else}
    <div
        class="bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative p-6 pb-12 {classes}"
    >
        <!-- Balance -->
        <div data-label="total-balance" class="flex flex-col flex-wrap">
            <Text type="p">
                {localize('general.balance')}
            </Text>
            <div class="flex flex-col flex-wrap items-start mt-6">
                <div on:click={togglePreciseBalance}>
                    <h1 class="font-600 text-32 leading-120 text-gray-800 dark:text-white break-all">
                        {showPreciseBalance
                            ? formatUnitPrecision($selectedAccountStore?.rawIotaBalance, Unit.Mi)
                            : formatUnitBestMatch($selectedAccountStore?.rawIotaBalance, true, 3)}
                    </h1>
                </div>
                <Text type="p">
                    {$selectedAccountStore?.balanceEquiv}
                </Text>
            </div>
        </div>
        {#if $accountRoute === AccountRoute.Init}
            <!-- Action Send / Receive -->
            <div class="flex flex-row justify-between space-x-4 mt-6">
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
        <button
            on:click={() => onMenuClick()}
            class="px-2 py-3 flex flex-row space-x-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white dark:bg-opacity-50 rounded-lg absolute top-6 right-6"
        >
            {#each Array(3) as _}
                <svg width="4" height="4" viewBox="0 0 4 4">
                    <circle cx="2" cy="2" r="2" class="fill-current" />
                </svg>
            {/each}
        </button>
    </div>
{/if}

<style>
    .safe-area {
        padding-top: calc(env(safe-area-inset-top) + 80px);
    }
</style>
