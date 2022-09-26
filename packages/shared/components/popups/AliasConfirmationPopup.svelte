<script lang="typescript">
    import { Button, KeyValueBox, Text, Error } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth } from '@core/profile'
    import { getStorageDepositFromOutput } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { BaseError } from '@core/error'
    import { isTransferring } from '@lib/wallet'

    let storageDeposit = 0
    let error: Error

    $: address = $selectedAccount.depositAddress

    prepareOutput()

    async function prepareOutput() {
        const aliasOutput = {
            aliasId: '0x0000000000000000000000000000000000000000000000000000000000000000',
            unlockConditions: [
                {
                    type: 4,
                    address: {
                        type: 0,
                        pubKeyHash: address,
                    },
                },
                {
                    type: 5,
                    address: {
                        type: 0,
                        pubKeyHash: address,
                    },
                },
            ],
        }

        try {
            const preparedOutput = await $selectedAccount.buildAliasOutput(aliasOutput)
            storageDeposit = getStorageDepositFromOutput(preparedOutput).storageDeposit
        } catch (err) {
            console.error(err)
        }
    }

    function createAlias(): void {
        closePopup()
    }

    async function onConfirm(): Promise<void> {
        error = null
        try {
            await checkActiveProfileAuth(createAlias, { stronghold: true, ledger: false })
        } catch (err) {
            if (!error) {
                error = err.error ? new BaseError({ message: err.error ?? err.message, logToConsole: true }) : err
            }
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
