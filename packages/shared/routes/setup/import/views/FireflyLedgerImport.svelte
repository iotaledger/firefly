<script>
    import { createEventDispatcher } from 'svelte'
    import { OnboardingLayout, Illustration, Text, Button } from 'shared/components'
    import { api } from 'shared/lib/wallet'
    import { DEFAULT_NODE as node, DEFAULT_NODES as nodes } from 'shared/lib/network'

    export let locale
    export let mobile
    let restoring = false

    const dispatch = createEventDispatcher()

    function restore() {
        restoring = true
        api.createAccount(
            {
                clientOptions: { node, nodes },
                signerType: { type: 'LedgerNanoSimulator' }
            },
            {
                onSuccess(createAccountResponse) {
                    api.syncAccount(createAccountResponse.payload.id, {
                        onSuccess(syncAccountResponse) {
                            restoring = false
                            const balance = syncAccountResponse.payload.addresses.reduce((total, address) => total + address.balance, 0)
                            dispatch('next', { balance })
                        },
                        onError(error) {
                            restoring = false
                            console.error(error)
                        }
                    })
                },
                onError(error) {
                    restoring = false
                    console.error(error);
                }
            }
        )
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
        <Text type="h2" classes="mb-5">{locale('views.import-from-firefly-ledger.title')}</Text>
        <Text type="p" secondary classes="mb-8">{locale('views.import-from-firefly-ledger.body')}</Text>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" disabled={restoring} onClick={restore}>
            {locale(restoring ? 'views.import-from-firefly-ledger.restoring' : 'actions.restore')}
        </Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-end items-center">
        <Illustration illustration="import-from-firefly-ledger-desktop" height="100%" width="auto"
            classes="h-full object-cover object-left" />
    </div>
</OnboardingLayout>
{/if}