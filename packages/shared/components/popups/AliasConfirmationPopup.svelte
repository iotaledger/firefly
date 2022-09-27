<script lang="typescript">
    import { Button, KeyValueBox, Text, Error } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { convertBech32ToEd25519 } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { BaseError } from '@core/error'
    import { isTransferring } from '@lib/wallet'
    import type { AliasOutputOptions } from '@iota/wallet'

    let storageDeposit = 0
    const aliasOutputOptions: AliasOutputOptions = null
    let error: Error

    $: address = $selectedAccount.depositAddress
    $: aliasOutput = address
        ? {
              aliasId: '0x0000000000000000000000000000000000000000000000000000000000000000',
              unlockConditions: [
                  {
                      type: 4, // Governor
                      address: {
                          type: 0,
                          pubKeyHash: `0x${convertBech32ToEd25519(address)}`,
                      },
                  },
                  {
                      type: 5, // State controller
                      address: {
                          type: 0,
                          pubKeyHash: `0x${convertBech32ToEd25519(address)}`,
                      },
                  },
              ],
          }
        : ''

    $: setStorageDeposit(aliasOutput)

    async function setStorageDeposit(aliasOutput) {
        try {
            const preparedOutput = await $selectedAccount.buildAliasOutput(aliasOutput)
            const aliasOutputOptions = {
                amount: preparedOutput.amount,
                aliasId: preparedOutput.aliasId,
                stateIndex: preparedOutput.stateIndex,
                stateMetadata: preparedOutput.stateMetadata,
                foundryCounter: preparedOutput.foundryCounter,
                immutableFeatures: preparedOutput.immutableFeatures,
            }
            storageDeposit = Number(aliasOutputOptions.amount)
        } catch (err) {
            console.error(err)
        }
    }

    async function createAlias(): Promise<void> {
        await $selectedAccount.createAliasOutput(aliasOutputOptions)
        closePopup()
    }

    async function onConfirm(): Promise<void> {
        error = null
        try {
            $isTransferring = true
            await checkActiveProfileAuth(createAlias, { stronghold: true, ledger: false })
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error ?? err.message, logToConsole: true }) : err
            }
        } finally {
            $isTransferring = false
        }
    }

    function onCancel(): void {
        closePopup()
    }
</script>

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">{localize('popups.alias.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('general.storageDeposit')}
            valueText={storageDeposit}
            tooltipText={localize('tooltips.transactionDetails.incoming.storageDeposit')}
        />
        <KeyValueBox keyText={localize('general.governorAddress')} valueText={address} isCopyable />
        <KeyValueBox keyText={localize('general.stateControllerAddress')} valueText={address} isCopyable />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel} disabled={$isTransferring}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" onClick={onConfirm} disabled={$isTransferring} isBusy={$isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>
