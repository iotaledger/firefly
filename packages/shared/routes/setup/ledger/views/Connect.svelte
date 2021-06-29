<script>
    import { Button, Icon, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { ledgerSimulator, promptUserToConnectLedger } from 'shared/lib/ledger'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { walletSetupType } from 'shared/lib/router'
    import { SetupType } from 'shared/lib/typings/routes'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale
    export let mobile

    // TODO: add connection logic
    let connectedAndUnlocked = true
    let appOpen = true

    let newLedgerProfile
    let creatingAccount = false

    $: illustration = connectedAndUnlocked && appOpen ? 'ledger-connect-connected-desktop' : 'ledger-connect-disconnected-desktop'

    const dispatch = createEventDispatcher()

    onMount(() => {
        newLedgerProfile = $walletSetupType === SetupType.New
    })

    function createAccount() {
        creatingAccount = true
        const officialNodes = getOfficialNodes()
        const officialNetwork = getOfficialNetwork()

        const _onConnected = () => {
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
                    onSuccess() {
                        creatingAccount = false
                        dispatch('next')
                    },
                    onError(error) {
                        creatingAccount = false
                        console.error(error)
                    },
                }
            )
        }
        const _onCancel = () => (creatingAccount = false)
        promptUserToConnectLedger(_onConnected, _onCancel)
    }

    function handleTipsClick() {
        // TODO
    }

    function handleContinueClick() {
        if (newLedgerProfile) {
            createAccount()
        } else {
            dispatch('next')
        }
    }

    function handleBackClick() {
        dispatch('previous')
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content">
            <Text type="h2" classes="mb-5">{locale('views.connectLedger.title')}</Text>
            <Text type="p" secondary classes="mb-5">{locale('views.connectLedger.body')}</Text>
            <div class="flex flex-col flex-nowrap space-y-2">
                <div class="flex flex-row space-x-2">
                    <Icon
                        icon={`status-${connectedAndUnlocked ? 'success' : 'error'}`}
                        classes={`text-white bg-${connectedAndUnlocked ? 'green' : 'red'}-600 rounded-full`} />
                    <Text type="p" secondary>{locale('views.connectLedger.trafficLight1')}</Text>
                </div>
                <div class="flex flex-row space-x-2">
                    <Icon
                        icon={`status-${appOpen ? 'success' : 'error'}`}
                        classes={`text-white bg-${appOpen ? 'green' : 'red'}-600 rounded-full`} />
                    <Text type="p" secondary>{locale('views.connectLedger.trafficLight2')}</Text>
                </div>
            </div>
        </div>
        <div slot="leftpane__action">
            <Text on:click={handleTipsClick} highlighted classes="flex flex-row justify-center items-center cursor-pointer mb-10">
                <Icon icon="info" classes="text-blue-500 mr-2" />
                {locale('views.connectLedger.tips')}
            </Text>
            <Button
                classes="w-full"
                disabled={!connectedAndUnlocked || !appOpen || creatingAccount}
                onClick={handleContinueClick}>
                {#if creatingAccount}
                    <Spinner busy message={locale('general.creatingAccount')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-gray-50 dark:bg-gray-900">
            <Illustration width="100%" {illustration} />
        </div>
    </OnboardingLayout>
{/if}
