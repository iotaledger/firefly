<script lang="typescript">
    import { Animation, Button, Number, OnboardingLayout, Spinner, Text, Toggle, Tooltip, Icon } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { ADDRESS_SECURITY_LEVEL, getLedgerMigrationData, hardwareIndexes } from 'shared/lib/migration'
    import { popupState } from 'shared/lib/popup'
    import { onDestroy, createEventDispatcher } from 'svelte'
    import { LedgerAppName } from 'shared/lib/typings/ledger'

    export let locale
    export let mobile

    let busy = false
    let expert = false
    let showTooltip = false
    let showInfo = false
    let toolTip

    let min = 0
    let max = 2147483647

    let index = 0
    let page = 0

    $: index = checkNumber(index)
    $: page = checkNumber(page)

    $: if (!busy) { 
        showInfo = false 
        showTooltip = false 
    }

    let isValidAccountIndex = false
    $: isValidAccountIndex = isValidNumber(index)
    let isValidAccountPage = false
    $: isValidAccountPage = isValidNumber(page)

    const dispatch = createEventDispatcher()

    function checkNumber(n: number): number {
        if (!isWithinRange(n)) n = Math.min(Math.max(n, min), max)

        return n
    }

    function isValidNumber(n: number): boolean {
        return isPositiveInteger(n) && isWithinRange(n)
    }

    function isPositiveInteger(n: number): boolean {
        return /^[0-9]+$/.test(String(n))
    }

    function isWithinRange(n: number): boolean {
        return n >= min && n <= max
    }

    function handleContinueClick() {
        busy = true
        const _onConnected = () => {
            Electron.ledger
                .selectSeed(index, page, ADDRESS_SECURITY_LEVEL)
                .then(({ iota, callback }) => {
                    showInfo = true
                    return getLedgerMigrationData(iota.getAddress, callback)
                })
                .then((data) => {
                    busy = false

                    hardwareIndexes.update((_indexes) => Object.assign({}, _indexes, { accountIndex: index, pageIndex: page }))
                    dispatch('next', { balance: data.balance })
                })
                .catch((error) => {
                    busy = false
                    displayNotificationForLedgerProfile('error', true, true, false, true, error)

                    console.error(error)
                })
        }
        const _onCancel = () => (busy = false)
        promptUserToConnectLedger(true, _onConnected, _onCancel)
    }

    function handleBackClick() {
        dispatch('previous')
    }

    function toggleTooltip() {
        showTooltip = !showTooltip
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout {busy} onBackClick={handleBackClick} {locale} showLedgerProgress showLedgerVideoButton>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.selectLedgerAccountIndex.title')}</Text>
            <Text type="p" secondary>{locale('views.selectLedgerAccountIndex.body')}</Text>
            <div class="flex flex-col space-y-4 mt-8">
                <div class="flex row space-x-2 items-center">
                    <Text type="p" smaller highlighted={!expert}>{locale('views.selectLedgerAccountIndex.standard')}</Text>
                    <Toggle
                        active={expert}
                        onClick={() => {
                            expert = !expert
                        }}
                        classes="cursor-pointer" />
                    <Text type="p" smaller highlighted={expert}>{locale('views.selectLedgerAccountIndex.expert')}</Text>
                </div>
                <div>
                    <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountIndex')}</Text>
                    <Number
                        bind:value={index}
                        {min}
                        {max}
                        disabled={busy}
                        error={!isValidAccountIndex ? locale('error.account.index') : ''} />
                </div>
                {#if expert}
                    <div>
                        <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountPage')}</Text>
                        <Number
                            bind:value={page}
                            {min}
                            {max}
                            disabled={busy}
                            error={!isValidAccountPage ? locale('error.account.page') : ''} />
                    </div>
                {/if}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            {#if showInfo && !$popupState.active}
                <div
                    class="flex flex-row w-full mb-4 justify-center"
                    on:mouseenter={() => toggleTooltip()}
                    on:mouseleave={() => toggleTooltip()}
                    bind:this={toolTip}>
                    <Icon icon="info" classes="mr-1 text-gray-800 dark:text-white" width={20} height={20} />
                    <Text>{locale('views.selectLedgerAccountIndex.notGeneratingAddresses')}</Text>
                </div>
            {/if}
            {#if showTooltip}
                <Tooltip
                    parentTop={toolTip.getBoundingClientRect().top - 20}
                    parentLeft={toolTip.getBoundingClientRect().left}
                    parentWidth={toolTip.offsetWidth / 2}
                    classes="max-w-md">
                    <Text classes="break-words">
                        {locale('views.selectLedgerAccountIndex.reinstallLegacy', {
                            values: { legacy: LedgerAppName.IOTALegacy },
                        })}
                    </Text>
                </Tooltip>
            {/if}
            <Button classes="w-full" disabled={busy || !isValidAccountIndex || !isValidAccountPage} onClick={handleContinueClick}>
                {#if busy}
                    <Spinner busy={true} message={locale('views.migrate.findingBalance')} classes="justify-center" />
                {:else}{locale('actions.confirm')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-orange-50 dark:bg-gray-900">
            <Animation width="100%" animation="ledger-choose-index-desktop" />
        </div>
    </OnboardingLayout>
{/if}
