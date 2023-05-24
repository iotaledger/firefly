<script lang="ts">
    import { get } from 'svelte/store'

    import { ExpirationTimePicker } from '@components'
    import { ActivityInformation, BasicActivityDetails, Button, KeyValueBox, TextHint, Toggle } from '@ui'

    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { getDestinationNetworkFromAddress } from '@core/layer-2'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { TimePeriod } from '@core/utils'
    import {
        ActivityDirection,
        ActivityType,
        InclusionState,
        newTransactionDetails,
        NewTransactionType,
        selectedAccountAssets,
    } from '@core/wallet'
    import { ActivityAction } from '@core/wallet/enums'

    import { DrawerId, openDrawer } from '@/auxiliary/drawer'
    import { sendRouter } from '@/routers'
    import { NetworkId } from '@core/network'

    export let sendTransaction: () => Promise<void>
    export let storageDeposit: number
    export let initialExpirationDate: TimePeriod
    export let expirationDate: Date
    export let visibleSurplus: number = 0

    const { recipient, giftStorageDeposit, surplus, disableChangeExpiration, disableToggleGift, layer2Parameters } =
        get(newTransactionDetails)

    let loading: boolean = false

    // need to store the newTransactionDetails to avoid errors
    let transactionDetails = get(newTransactionDetails)
    // need to update the variable only when newTransactionDetails is not reset
    $: if ($newTransactionDetails.recipient) {
        transactionDetails = $newTransactionDetails
    }

    $: isInternal = recipient?.type === 'account'
    $: isTransferring = $selectedAccount.isTransferring
    // TODO: replace Testnet with the profile network
    $: hideGiftToggle =
        (transactionDetails.type === NewTransactionType.TokenTransfer &&
            transactionDetails.asset.id === $selectedAccountAssets[NetworkId.Testnet]?.baseCoin?.id) ||
        (disableToggleGift && !giftStorageDeposit) ||
        layer2Parameters !== undefined

    $: activity = {
        ...transactionDetails,
        storageDeposit,
        subject: recipient,
        isInternal,
        giftedStorageDeposit: 0,
        surplus: visibleSurplus,
        type: ActivityType.Basic,
        direction: ActivityDirection.Outgoing,
        inclusionState: InclusionState.Pending,
        action: ActivityAction.Send,
        destinationNetwork: getDestinationNetworkFromAddress(layer2Parameters?.networkAddress),
    }

    async function asyncSendTransaction(): Promise<void> {
        try {
            loading = true
            await sendTransaction()
        } catch (err) {
            loading = false
        } finally {
            loading = false
        }
    }

    async function onSendClick(): Promise<void> {
        const isUnlocked = await isStrongholdUnlocked()
        const _onConfirm = async (): Promise<void> => {
            await asyncSendTransaction()
            $sendRouter.next()
        }
        if (isUnlocked) {
            _onConfirm()
        } else {
            openDrawer(DrawerId.EnterPassword, { onSuccess: _onConfirm })
        }
    }

    function onAddReferenceClick(): void {
        openDrawer(DrawerId.References)
    }

    function onAddExpirationClick(): void {
        openDrawer(DrawerId.Expiration)
    }

    function toggleGiftStorageDeposit(): void {
        newTransactionDetails.update((details) => ({ ...details, giftStorageDeposit: !details.giftStorageDeposit }))
    }
</script>

<div class="w-full overflow-y-auto flex flex-col flex-auto h-1 justify-between">
    <div class="flex flex-row flex-1 justify-center relative">
        <div class="w-full flex-col space-y-6 pt-10">
            <BasicActivityDetails {activity} networkAddress={layer2Parameters?.networkAddress} />
            <div class="flex flex-col space-y-2">
                <ActivityInformation {activity} networkAddress={layer2Parameters?.networkAddress} />
                {#if !hideGiftToggle}
                    <KeyValueBox keyText={localize('general.giftStorageDeposit')}>
                        <Toggle
                            slot="value"
                            color="green"
                            disabled={$newTransactionDetails.disableToggleGift}
                            active={$newTransactionDetails.giftStorageDeposit}
                            onClick={toggleGiftStorageDeposit}
                        />
                    </KeyValueBox>
                {/if}
                {#if initialExpirationDate !== undefined}
                    <KeyValueBox keyText={localize('general.expirationTime')}>
                        <ExpirationTimePicker
                            slot="value"
                            bind:value={expirationDate}
                            disabled={disableChangeExpiration}
                            onClick={onAddExpirationClick}
                        />
                    </KeyValueBox>
                {/if}
                {#if surplus}
                    <TextHint warning text={localize('popups.transaction.surplusIncluded')} />
                {/if}
            </div>
        </div>
    </div>
    <div class="flex flex-col space-y-4">
        <Button outline onClick={onAddReferenceClick} disabled={loading || isTransferring} classes="w-full">
            {localize('actions.addReference')}
        </Button>
        <Button
            isBusy={loading || isTransferring}
            onClick={onSendClick}
            disabled={loading || isTransferring}
            classes="w-full"
        >
            {localize('actions.send')}
        </Button>
    </div>
</div>
