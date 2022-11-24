<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { ActivityDirection, ActivityType, InclusionState, newTransactionDetails, Subject } from '@core/wallet'
    import { BasicActivityDetails, Button } from 'shared/components'
    import { onMount } from 'svelte'

    export let sendTransaction: () => Promise<void>
    export let triggerSendOnMount: boolean = false
    export let storageDeposit: number

    let recipient: Subject
    let loading: boolean = false

    $: surplus = $newTransactionDetails.surplus
    $: recipient = $newTransactionDetails?.recipient
    $: isInternal = recipient.type === 'account'
    $: isTransferring = $selectedAccount.isTransferring
    $: networkAddress = $newTransactionDetails.layer2Parameters?.networkAddress

    onMount(() => {
        if (triggerSendOnMount) {
            asyncSendTransaction()
        }
    })

    async function asyncSendTransaction(): Promise<void> {
        try {
            loading = true
            await sendTransaction()
        } catch (err) {
            loading = false
        }
    }

    function onContinueClick(): void {
        asyncSendTransaction()
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <div class="flex flex-row flex-1 items-center justify-center relative">
        <BasicActivityDetails
            {...$newTransactionDetails}
            {storageDeposit}
            subject={$newTransactionDetails?.recipient}
            {isInternal}
            {surplus}
            type={ActivityType.Transaction}
            direction={ActivityDirection.Outgoing}
            inclusionState={InclusionState.Pending}
            {networkAddress}
        />
    </div>
    <div class="flex flex-col space-y-4">
        <Button
            isBusy={loading || isTransferring}
            onClick={onContinueClick}
            disabled={loading || isTransferring}
            classes="w-full"
        >
            {localize('actions.send')}
        </Button>
    </div>
</div>
