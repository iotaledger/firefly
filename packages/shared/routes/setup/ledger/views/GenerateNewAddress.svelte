<script lang="typescript">
    import { Button, Icon, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import {
        formatToLedgerDisplay,
        ledgerSimulator,
        notifyLedgerDeviceState,
        promptUserToConnectLedger
    } from 'shared/lib/ledger'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    let newAddress = null

    let busy = false
    let confirmed = false

    const dispatch = createEventDispatcher()

    $: illustration = !newAddress
        ? 'ledger-generate-address-desktop'
        : confirmed
        ? 'ledger-address-confirmed-desktop'
        : 'ledger-confirm-address-desktop'

    function generateNewAddress() {
        newAddress = null
        busy = true

        const _onConnected = () => {
            api.getAccounts({
                onSuccess(getAccountsResponse) {
                    // If we have already created an account, just get the first address of the first account
                    if (getAccountsResponse.payload.length > 0) {
                        newAddress = getAccountsResponse.payload[0].addresses[0].address

                        displayAddress()
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

                                    displayAddress()
                                },
                                onError(error) {
                                    busy = false

                                    console.error(error)

                                    notifyLedgerDeviceState('error', true, true, false, false, error)
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

        const _onCancel = () => (busy = false)
        promptUserToConnectLedger(false, _onConnected, _onCancel)
    }

    function displayAddress() {
        api.getMigrationAddress(true, {
            onSuccess() {
                busy = false

                handleConfirmClick()
            },
            onError(err) {
                newAddress = null
                busy = false

                console.error(err)

                notifyLedgerDeviceState('error', true, true)
            },
        })
    }

    function handleConfirmClick() {
        confirmed = true
    }

    function handleContinueClick() {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick} {busy} {locale} showLedgerProgress showLedgerVideoButton>
        <div slot="leftpane__content">
            {#if !newAddress}
                <Text type="h2" classes="mb-5">{locale('views.generateNewLedgerAddress.title')}</Text>
                <Text type="p" secondary>{locale('views.generateNewLedgerAddress.body')}</Text>
            {:else if !confirmed}
                <Text type="h2" classes="mb-5">{locale('views.generateNewLedgerAddress.confirmTitle')}</Text>
                <Text type="p" secondary classes="mb-10">{locale('views.generateNewLedgerAddress.confirmBody')}</Text>
                <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
                    <Text type="h5" highlighted classes="mb-2">{locale('general.newAddress')}</Text>
                    <Text type="pre">{formatToLedgerDisplay(newAddress)}</Text>
                </div>
            {:else}
                <Text type="h2" classes="mb-5">{locale('views.generateNewLedgerAddress.confirmedTitle')}</Text>
                <Text type="p" secondary classes="mb-12">{locale('views.generateNewLedgerAddress.confirmedBody')}</Text>
                <div class="flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-lg p-5 text-center">
                    <div class="bg-green-100 rounded-2xl relative -mt-10 mb-4">
                        <Icon icon="success-check" classes="text-white" />
                    </div>
                    <Text type="h5" highlighted classes="mb-2">{locale('general.newAddress')}</Text>
                    <Text type="pre">{formatToLedgerDisplay(newAddress)}</Text>
                </div>
            {/if}
        </div>
        <div slot="leftpane__action" class="flex flex-col space-y-4">
            {#if newAddress}
                <Button classes="w-full" disabled={!confirmed} onClick={handleContinueClick}>{locale('actions.continue')}</Button>
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
        <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <Illustration width="100%" {illustration} />
        </div>
    </OnboardingLayout>
{/if}
