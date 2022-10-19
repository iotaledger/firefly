<script lang="typescript">
    import { Button, KeyValueBox, Text, FontWeight, TextType } from 'shared/components'
    import { selectedAccount, updateSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, activeProfile } from '@core/profile'
    import {
        Activity,
        addActivityToAccountActivitiesInAllAccountActivities,
        convertBech32ToHexAddress,
        formatTokenAmountPrecise,
        EMPTY_HEX_ID,
        preprocessTransaction,
        UNLOCK_CONDITION_GOVERNOR_ADDRESS,
        UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS,
    } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { onMount } from 'svelte'
    import { BASE_TOKEN } from '@core/network'
    import { handleError } from '@core/error/handlers/handleError'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit: string = '0'

    $: address = {
        type: 0,
        pubKeyHash: convertBech32ToHexAddress($selectedAccount.depositAddress),
    }
    $: aliasOutput = address
        ? {
              aliasId: EMPTY_HEX_ID,
              unlockConditions: [
                  {
                      type: UNLOCK_CONDITION_GOVERNOR_ADDRESS,
                      address,
                  },
                  {
                      type: UNLOCK_CONDITION_STATE_CONTROLLER_ADDRESS,
                      address,
                  },
              ],
          }
        : ''

    $: void setStorageDeposit(aliasOutput)
    $: isTransferring = $selectedAccount.isTransferring

    async function setStorageDeposit(aliasOutput): Promise<void> {
        try {
            const { amount } = await $selectedAccount.buildAliasOutput(aliasOutput)
            storageDeposit = formatTokenAmountPrecise(Number(amount), BASE_TOKEN[$activeProfile?.networkProtocol])
        } catch (err) {
            handleError(err)
        }
    }

    async function createAlias(): Promise<void> {
        try {
            updateSelectedAccount({ isTransferring: true })
            const transaction = await $selectedAccount.createAliasOutput()
            const activity = new Activity(preprocessTransaction(transaction), $selectedAccount)
            addActivityToAccountActivitiesInAllAccountActivities($selectedAccount.index, activity)
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            updateSelectedAccount({ isTransferring: false })
        }
    }

    async function onConfirm(): Promise<void> {
        await checkActiveProfileAuth(createAlias, { stronghold: true, ledger: false })
    }

    function onCancel(): void {
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

<send-confirmation-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">{localize('popups.alias.title')}</Text
    >
    <div class="w-full flex-col space-y-2">
        <KeyValueBox
            keyText={localize('general.storageDeposit')}
            valueText={storageDeposit}
            tooltipText={localize('tooltips.transactionDetails.incoming.storageDeposit')}
        />
        <KeyValueBox
            keyText={localize('general.governorAddress')}
            valueText={$selectedAccount.depositAddress}
            isCopyable
        />
        <KeyValueBox
            keyText={localize('general.stateControllerAddress')}
            valueText={$selectedAccount.depositAddress}
            isCopyable
        />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancel} disabled={isTransferring}>
            {localize('actions.cancel')}
        </Button>
        <Button autofocus classes="w-full" onClick={onConfirm} disabled={isTransferring} isBusy={isTransferring}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</send-confirmation-popup>
