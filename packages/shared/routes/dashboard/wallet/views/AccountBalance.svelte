<script lang="typescript">
    import { Unit } from '@iota/unit-converter'
    import { Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { localize } from '@core/i18n'
    import { accountRoute, accountRouter } from '@core/router'
    import { AccountRoute } from '@core/router/enums'
    import { formatUnitBestMatch, formatUnitPrecision } from 'shared/lib/units'
    import { selectedAccount } from 'shared/lib/wallet'
    import { spring } from 'svelte/motion'

    export let classes = ''
    export let scale = spring(1)
    export let onMenuClick = (): void => {}

    let showPreciseBalance = false

    function handleSendClick() {
        $accountRouter.goTo(AccountRoute.Send)
    }
    function handleReceiveClick() {
        $accountRouter.goTo(AccountRoute.Receive)
    }

    function getScaleStyle(factor: number): string {
        return `scale(${factor}, ${factor})`
    }

    function getTranslateStyle(x: number, y: number, unit: string) {
        return `translate(${x}${unit}, ${y}${unit})`
    }

    function animateMobileBalance(node: HTMLElement): void {
        scale.subscribe((curr) => {
            const scaleQuad = 0.4 * curr * curr + 0.6
            const transQuad = 1 - curr * curr
            const posX = node.getBoundingClientRect().left
            const scale = getScaleStyle(scaleQuad)
            const translate = getTranslateStyle(posX * 0.75 * transQuad, -110 * transQuad, 'px')

            node.style.transform = `${scale} ${translate}`
        })
    }

    function animateMobileCurrency(node: HTMLElement): void {
        const opacity = 1
        scale.subscribe((curr) => {
            const speedUp = curr - (1 - curr)
            const scale = getScaleStyle(curr)
            const translate = getTranslateStyle(0, -7 * (1 - curr), 'vh')

            node.style.transform = `${translate} ${scale}`
            node.style.opacity = `${opacity * speedUp}`
        })
    }

    function animateMobileButtons(node: HTMLElement): void {
        const opacity = 1
        scale.subscribe((curr) => {
            const speedUp = curr - (1 - curr)
            const scale = getScaleStyle(curr)
            const translate = getTranslateStyle(0, -15 * (1 - curr), 'vh')

            node.style.transform = `${translate} ${scale}`
            node.style.opacity = `${opacity * speedUp}`
        })
    }

    function animateMobileWalletMenu(node: HTMLElement): void {
        const opacity = 1
        scale.subscribe((curr) => {
            const speedUp = curr - (1 - curr)
            node.style.opacity = `${opacity * speedUp}`
        })
    }

    function togglePreciseBalance() {
        showPreciseBalance = !showPreciseBalance
    }
</script>

{#if $mobile}
    <div
        class="bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative p-6 pb-0 pt-20 bg-transparent {classes}"
    >
        <!-- Balance -->
        <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
            <div class="flex flex-col flex-wrap items-center">
                <div on:click={togglePreciseBalance} use:animateMobileBalance>
                    <Text type="h1">
                        {showPreciseBalance
                            ? formatUnitPrecision($selectedAccount?.rawIotaBalance, Unit.Mi)
                            : formatUnitBestMatch($selectedAccount?.rawIotaBalance, true, 3)}
                    </Text>
                </div>
                <div use:animateMobileCurrency>
                    <Text type="h4" smaller overrideColor="true" classes={mobile && 'text-gray-500'}>
                        {$selectedAccount?.balanceEquiv}
                    </Text>
                </div>
            </div>
        </div>
        <!-- Action Send / Receive -->
        <div class="flex flex-row justify-between space-x-4 mt-7 {$mobile && 'mb-10'}" use:animateMobileButtons>
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
        <button
            on:click={() => onMenuClick()}
            use:animateMobileWalletMenu
            class="menu-mobile px-2 py-3 flex flex-row space-x-1 text-gray-900 dark:text-white absolute top-6 right-6"
        >
            {#each Array(3) as _}
                <svg width="4" height="4" viewBox="0 0 4 4">
                    <circle cx="2" cy="2" r="2" class="fill-current" />
                </svg>
            {/each}
        </button>
    </div>
{:else}
    <div
        class="bg-gradient-to-t from-gray-100 via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-800 relative p-6 pb-12 {classes}"
    >
        <!-- Balance -->
        <div data-label="total-balance" class="flex flex-col flex-wrap space-y-1.5">
            <p class="text-11 leading-120 text-gray-800 dark:text-white uppercase tracking-widest">
                {localize('general.balance')}
            </p>
            <div class="flex flex-col flex-wrap 'items-start space-y-1.5 mr-12">
                <div on:click={togglePreciseBalance}>
                    <Text type="h2">
                        {showPreciseBalance
                            ? formatUnitPrecision($selectedAccount?.rawIotaBalance, Unit.Mi)
                            : formatUnitBestMatch($selectedAccount?.rawIotaBalance, true, 3)}
                    </Text>
                </div>
                <Text type="p" smaller overrideColor="false" classes={mobile && 'text-gray-500'}>
                    {$selectedAccount?.balanceEquiv}
                </Text>
            </div>
        </div>
        {#if $accountRoute === AccountRoute.Init}
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
        <button
            on:click={() => onMenuClick()}
            class="bg-opacity-10 bg-gray-50 dark:bg-gray-900 dark:bg-opacity-50 rounded-lg px-2 py-3 flex flex-row space-x-1 text-gray-900 dark:text-white absolute top-6 right-6"
        >
            {#each Array(3) as _}
                <svg width="4" height="4" viewBox="0 0 4 4">
                    <circle cx="2" cy="2" r="2" class="fill-current" />
                </svg>
            {/each}
        </button>
    </div>
{/if}

<style type="text/scss">
    .menu-mobile {
        position: absolute;
        margin-top: -8px;
        right: 25px;
    }
</style>
