<script lang="typescript">
    import { onDestroy, createEventDispatcher } from 'svelte'
    import { Animation, Button, Number, OnboardingLayout, Spinner, Text, Toggle, Icon } from 'shared/components'
    import { localize } from '@core/i18n'
    import { displayNotificationForLedgerProfile, promptUserToConnectLedger } from '@lib/ledger'
    import { ADDRESS_SECURITY_LEVEL, hardwareIndexes } from '@lib/migration'
    import { Platform } from '@lib/platform'
    import { popupState } from '@lib/popup'
    import { LedgerAppName } from '@lib/typings/ledger'

    const dispatch = createEventDispatcher()
    const min = 0
    const max = 2147483647

    let busy = false
    let expert = false
    let showInfo = false
    let infoTimeout: NodeJS.Timeout
    let index = 0
    let page = 0
    let isValidAccountIndex = false
    let isValidAccountPage = false

    $: index = checkNumber(index)
    $: page = checkNumber(page)
    $: isValidAccountIndex = isValidNumber(index)
    $: isValidAccountPage = isValidNumber(page)
    $: if (!busy) {
        showInfo = false
    }

    onDestroy(() => clearTimeout(infoTimeout))

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

    function handleContinueClick(): void {
        busy = true
        function _onConnected(): void {
            infoTimeout = setTimeout(() => (showInfo = true), 180000)
            Platform.ledger
                .selectSeed(index, page, ADDRESS_SECURITY_LEVEL)
                // .then(({ iota, callback }) => getLedgerMigrationData(iota.getAddress, callback))
                .then((data) => {
                    busy = false

                    hardwareIndexes.update((_indexes) =>
                        Object.assign({}, _indexes, { accountIndex: index, pageIndex: page })
                    )
                    dispatch('next', { balance: data?.balance })
                })
                .catch((error) => {
                    busy = false
                    displayNotificationForLedgerProfile('error', true, true, error)
                    showInfo = false
                    clearTimeout(infoTimeout)
                    console.error(error)
                })
        }
        function _onCancel(): void {
            busy = false
        }
        promptUserToConnectLedger(_onConnected, _onCancel)
    }

    function handleBackClick(): void {
        dispatch('previous')
    }
</script>

<OnboardingLayout {busy} onBackClick={handleBackClick} showLedgerProgress showLedgerVideoButton>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.selectLedgerAccountIndex.title')}</Text>
        <Text type="p" secondary>{localize('views.selectLedgerAccountIndex.body')}</Text>
        <div class="flex flex-col space-y-4 mt-8">
            <div class="flex row space-x-2 items-center">
                <Text type="p" smaller highlighted={!expert}>{localize('views.selectLedgerAccountIndex.standard')}</Text
                >
                <Toggle
                    active={expert}
                    onClick={() => {
                        expert = !expert
                    }}
                    classes="cursor-pointer"
                />
                <Text type="p" smaller highlighted={expert}>{localize('views.selectLedgerAccountIndex.expert')}</Text>
            </div>
            <div>
                <Text type="p" secondary classes="mb-2">{localize('views.selectLedgerAccountIndex.accountIndex')}</Text>
                <Number
                    bind:value={index}
                    {min}
                    {max}
                    disabled={busy}
                    error={!isValidAccountIndex ? localize('error.account.index') : ''}
                />
            </div>
            {#if expert}
                <div>
                    <Text type="p" secondary classes="mb-2"
                        >{localize('views.selectLedgerAccountIndex.accountPage')}</Text
                    >
                    <Number
                        bind:value={page}
                        {min}
                        {max}
                        disabled={busy}
                        error={!isValidAccountPage ? localize('error.account.page') : ''}
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
                <Text type="h3" classes="mb-4 text-center"
                    >{localize('views.selectLedgerAccountIndex.takingAWhile')}</Text
                >
                <Text classes="mb-4 text-center"
                    >{localize('views.selectLedgerAccountIndex.notGeneratingAddresses')}</Text
                >
                <Text classes="break-words text-center">
                    {localize('views.selectLedgerAccountIndex.reinstallLegacy', {
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
                <Spinner busy={true} message={localize('views.migrate.findingBalance')} classes="justify-center" />
            {:else}{localize('actions.confirm')}{/if}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-orange-50 dark:bg-gray-900">
        <Animation width="100%" animation="ledger-choose-index-desktop" />
    </div>
</OnboardingLayout>
