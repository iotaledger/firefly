<script lang="typescript">
    import { Animation, Button, Number, OnboardingLayout, Spinner, Text, Toggle, Icon } from 'shared/components'
    import { Platform } from 'shared/lib/platform'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { ADDRESS_SECURITY_LEVEL, getLedgerMigrationData, hardwareIndexes } from 'shared/lib/migration'
    import { popupState } from 'shared/lib/popup'
    import { onDestroy, createEventDispatcher } from 'svelte'
    import { LedgerAppName } from 'shared/lib/typings/ledger'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    let busy = false
    let expert = false
    let showInfo = false
    let infoTimeout

    const min = 0
    const max = 2147483647

    let index = 0
    let page = 0

    $: index = checkNumber(index)
    $: page = checkNumber(page)

    $: if (!busy) {
        showInfo = false
    }

    onDestroy(() => clearTimeout(infoTimeout))

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
            infoTimeout = setTimeout(() => (showInfo = true), 180000)
            Platform.ledger
                .selectSeed(index, page, ADDRESS_SECURITY_LEVEL)
                .then(({ iota, callback }) => getLedgerMigrationData(iota.getAddress, callback))
                .then((data) => {
                    busy = false

                    hardwareIndexes.update((_indexes) =>
                        Object.assign({}, _indexes, { accountIndex: index, pageIndex: page })
                    )
                    dispatch('next', { balance: data.balance })
                })
                .catch((error) => {
                    busy = false
                    displayNotificationForLedgerProfile('error', true, true, false, true, error)
                    showInfo = false
                    clearTimeout(infoTimeout)
                    console.error(error)
                })
        }
        const _onCancel = () => (busy = false)
        promptUserToConnectLedger(true, _onConnected, _onCancel)
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

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
                    classes="cursor-pointer"
                />
                <Text type="p" smaller highlighted={expert}>{locale('views.selectLedgerAccountIndex.expert')}</Text>
            </div>
            <div>
                <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountIndex')}</Text>
                <Number
                    bind:value={index}
                    {min}
                    {max}
                    disabled={busy}
                    error={!isValidAccountIndex ? locale('error.account.index') : ''}
                />
            </div>
            {#if expert}
                <div>
                    <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountPage')}</Text
                    >
                    <Number
                        bind:value={page}
                        {min}
                        {max}
                        disabled={busy}
                        error={!isValidAccountPage ? locale('error.account.page') : ''}
                    />
                </div>
            {/if}
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-col space-y-4">
        {#if showInfo && !$popupState.active}
            <div class="relative flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mb-6 p-10 pb-6">
                <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                    <Icon icon="warning" classes="text-white" />
                </div>
                <Text type="h3" classes="mb-4 text-center">{locale('views.selectLedgerAccountIndex.takingAWhile')}</Text
                >
                <Text classes="mb-4 text-center">{locale('views.selectLedgerAccountIndex.notGeneratingAddresses')}</Text
                >
                <Text classes="break-words text-center">
                    {locale('views.selectLedgerAccountIndex.reinstallLegacy', {
                        values: { legacy: LedgerAppName.IOTALegacy },
                    })}
                </Text>
            </div>
        {/if}
        <Button
            classes="w-full"
            disabled={busy || !isValidAccountIndex || !isValidAccountPage}
            onClick={handleContinueClick}
        >
            {#if busy}
                <Spinner busy={true} message={locale('views.migrate.findingBalance')} classes="justify-center" />
            {:else}{locale('actions.confirm')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-orange-50 dark:bg-gray-900">
        <Animation width="100%" animation="ledger-choose-index-desktop" />
    </div>
</OnboardingLayout>
