<script lang="typescript">
    import { Button, Illustration, OnboardingLayout, Spinner, Text } from 'shared/components'
    import { getLedgerDeviceStatus, ledgerSimulator } from 'shared/lib/ledger'
    import { getOfficialNetwork, getOfficialNodes } from 'shared/lib/network'
    import { api } from 'shared/lib/wallet'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    let creatingAccount = false

    const dispatch = createEventDispatcher()

    function createAccount() {
        creatingAccount = true
        const officialNodes = getOfficialNodes()
        const officialNetwork = getOfficialNetwork()

        const onSuccess = () => {
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
                })
        }
        const onCancel = () => creatingAccount = false
        getLedgerDeviceStatus(onSuccess, onCancel)
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
            <Text type="h2" classes="mb-5">{locale('views.setupLedger.title')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body1')}</Text>
            <Text type="p" secondary classes="mb-2">{locale('views.setupLedger.body2')}</Text>
            <Text type="p" secondary>{locale('views.setupLedger.body3')}</Text>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" disabled={creatingAccount} onClick={createAccount}>
                {#if creatingAccount}
                    <Spinner busy message={locale('general.creatingAccount')} classes="justify-center" />
                {:else}{locale('actions.continue')}{/if}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-end items-center bg-pastel-blue dark:bg-gray-900">
            <Illustration width="100%" illustration="import-from-ledger-desktop" />
        </div>
    </OnboardingLayout>
{/if}
