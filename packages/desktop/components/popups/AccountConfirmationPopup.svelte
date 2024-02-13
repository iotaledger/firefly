<script lang="ts">
    import { Button, KeyValueBox, Text, FontWeight, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, getBaseToken } from '@core/profile'
    import {
        formatTokenAmountPrecise,
        EMPTY_HEX_ID,
        processAndAddToActivities,
        selectedWallet,
        updateSelectedWallet,
    } from '@core/wallet'
    import { UnlockConditionType, PreparedTransaction, AccountOutput } from '@iota/sdk/out/types'
    import { closePopup } from '@auxiliary/popup'
    import { onMount } from 'svelte'
    import { handleError } from '@core/error/handlers/handleError'
    import { plainToInstance } from 'class-transformer'
    import { api } from '@core/api'
    import { getClient } from '@core/wallet/actions/getClient'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    // TODO(2.0) Does it still make sense to have this popup?

    let storageDeposit: string = '0'

    $: address = {
        type: 0,
        pubKeyHash: api.bech32ToHex($selectedWallet.depositAddress),
    }
    $: accountOutput = address
        ? {
              accountId: EMPTY_HEX_ID,
              unlockConditions: [
                  {
                      type: UnlockConditionType.GovernorAddress,
                      address,
                  },
                  {
                      type: UnlockConditionType.StateControllerAddress,
                      address,
                  },
              ],
          }
        : ''

    $: void setStorageDeposit(accountOutput)
    $: isTransferring = $selectedWallet.isTransferring

    async function setStorageDeposit(accountOutput: AccountOutput): Promise<void> {
        try {
            const client = await getClient()
            const { amount } = await client.buildAccountOutput(accountOutput)
            storageDeposit = formatTokenAmountPrecise(Number(amount), getBaseToken())
        } catch (err) {
            handleError(err)
        }
    }

    async function createAccount(): Promise<void> {
        try {
            updateSelectedWallet({ isTransferring: true })
            const transaction = await $selectedWallet
                .prepareCreateAccountOutput()
                .then((prepared) => plainToInstance(PreparedTransaction, prepared).send())
            await processAndAddToActivities(transaction, $selectedWallet)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            updateSelectedWallet({ isTransferring: false })
        }
    }

    async function onConfirmClick(): Promise<void> {
        await checkActiveProfileAuth(createAccount, { stronghold: true, ledger: false })
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left"
        >{localize('popups.account.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('general.storageDeposit')}
            valueText={storageDeposit}
            tooltipText={localize('tooltips.transactionDetails.incoming.storageDeposit')}
        />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick} disabled={isTransferring}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" onClick={onConfirmClick} disabled={isTransferring} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>
