<script lang="typescript">
    import { Button, Icon, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { isLedgerConnected, ledgerSimulator, pollLedgerStatus, stopPollLedgerStatus } from 'shared/lib/ledger'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { popupState } from 'shared/lib/popup'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    let newAddress = null
    let busy = false
    let confirmed = false

    const dispatch = createEventDispatcher()

    $: if (!$isLedgerConnected && !$popupState?.active) {
        handleBackClick()
    }

    onMount(() => {
        pollLedgerStatus()
    })

    function generateNewAddress() {
        busy = true
        newAddress = null

        api.getAccounts({
            onSuccess(getAccountsResponse) {
                // If we have already created an account, just get the first address of the first account
                if (getAccountsResponse.payload.length > 0) {
                    newAddress = getAccountsResponse.payload[0].addresses[0].address
                    busy = false
                } else {
                    const officialNodes = getOfficialNodes()
                    const officialNetwork = getOfficialNetwork()
                    api.createAccount(
                        {
                            clientOptions: {
                                nodes: officialNodes,
                                node: officialNodes[Math.floor(Math.random() * officialNodes.length)],
                                network: officialNetwork,
                            },
                            alias: `${locale('general.account')} 1`,
                            signerType: { type: ledgerSimulator ? 'LedgerNanoSimulator' : 'LedgerNano' },
                        },
                        {
                            onSuccess(createAccountResponse) {
                                newAddress = createAccountResponse.payload.addresses[0].address

                                busy = false
                            },
                            onError(error) {
                                busy = false
                                console.error(error)
                            },
                        }
                    )
                }
            },
            onError(getAccountsError) {
                busy = false
                console.error(getAccountsError)
            },
        })
    }

    function handleConfirmClick() {
        confirmed = true
    }

    function handleContinueClick() {
        stopPollLedgerStatus()
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} busy={busy} {locale} showLedgerProgress showLedgerVideoButton>
        <div slot="leftpane__content">
            {#if confirmed}
                <div class="flex flex-col items-center bg-gray-100 dark:bg-gray-900 rounded-2xl mt-10 p-5 text-center">
                    <div class="bg-green-100 rounded-2xl relative -top-10">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h2" classes="mb-5 text-center">{locale('views.generateNewLedgerAddress.successTitle')}</Text>
                    <Text type="p" secondary classes="mb-2">{locale('views.generateNewLedgerAddress.successBody')}</Text>
                </div>
            {:else}
                <Text type="h2" classes="mb-5">{locale('general.generateNewAddress')}</Text>
                <Text type="p" secondary>{locale('views.generateNewLedgerAddress.body')}</Text>
                {#if newAddress}
                    <div class="mt-6 rounded-lg bg-gray-50 dark:bg-gray-700 p-4 text-center">
                        <Text type="pre">{newAddress}</Text>
                    </div>
                {/if}
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            {#if confirmed}
                <Button classes="w-full" onClick={handleContinueClick}>{locale('actions.continue')}</Button>
            {:else if newAddress}
                <Button classes="w-full" onClick={handleConfirmClick}>{locale('actions.confirm')}</Button>
            {:else}
                <Button classes="w-full" disabled={busy} onClick={generateNewAddress}>
                    {#if busy}
                        <Spinner
                            busy={true}
                            message={locale('views.generateNewLedgerAddress.generating')}
                            classes="justify-center" />
                    {:else}{locale('actions.generateAddress')}{/if}
                </Button>
            {/if}
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900" />
    </OnboardingLayout>
{/if}
