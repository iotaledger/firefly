<script lang="typescript">
    import { Button, Number, OnboardingLayout, Spinner, Text, Toggle } from 'shared/components'
    import { Electron } from 'shared/lib/electron'
    import { isLedgerLegacyConnected, pollLedgerLegacyStatus } from 'shared/lib/ledger'
    import { ADDRESS_SECURITY_LEVEL, getLedgerMigrationData, hardwareIndexes } from 'shared/lib/migration'
    import { popupState } from 'shared/lib/popup'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    let expert = false
    let loading = false

    let min = 0
    let max = 2147483647

    let index = 0
    let page = 0

    $: index = checkNumber(index)
    $: page = checkNumber(page)

    let isDisabled = false
    $: isDisabled = !isValidNumber(index) || !isValidNumber(page) || loading

    const dispatch = createEventDispatcher()

    $: if (!$isLedgerLegacyConnected && !$popupState?.active) {
        handleBackClick()
    }

    onMount(() => {
        pollLedgerLegacyStatus()
    })

    function checkNumber(n: number): number {
        if(!isWithinRange(n))
            n = Math.min(Math.max(n, min), max)

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
        loading = true

        Electron.ledger
            .selectSeed(index, page, ADDRESS_SECURITY_LEVEL)
            .then((iota) => {
                return getLedgerMigrationData(iota.getAddress)
            })
            .then((data) => {
                loading = false

                hardwareIndexes.update((_indexes) => Object.assign({}, _indexes, { accountIndex: index, pageIndex: page }))
                dispatch('next', { balance: data.balance })
            })
            .catch((error) => {
                loading = false
                console.error(error)
            })
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {locale} showLedgerProgress showLedgerVideoButton>
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
                    <Number bind:value={index} {min} {max} />
                </div>
                {#if expert}
                    <div>
                        <Text type="p" secondary classes="mb-2">{locale('views.selectLedgerAccountIndex.accountPage')}</Text>
                        <Number bind:value={page} {min} {max} />
                    </div>
                {/if}
            </div>
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            <Button classes="w-full" disabled={isDisabled} onClick={handleContinueClick}>
                {#if loading}
                    <Spinner busy={true} message={locale('views.generateNewLedgerAddress.generating')} classes="justify-center" />
                {:else}{locale('actions.confirm')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
