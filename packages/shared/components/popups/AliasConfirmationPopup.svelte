<script lang="typescript">
    import { Button, KeyValueBox, Text } from 'shared/components'
    import { FontWeight, TextType } from 'shared/components/Text.svelte'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { checkActiveProfileAuth, activeProfile } from '@core/profile'
    import { convertBech32ToEd25519, formatTokenAmountPrecise } from '@core/wallet'
    import { closePopup } from '@lib/popup'
    import { isTransferring } from '@lib/wallet'
    import { onMount } from 'svelte'
    import { BASE_TOKEN } from '@core/network'
    import { handleError } from '@core/error/handlers/handleError'

    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let storageDeposit: string = '0'

    $: address = {
        type: 0,
        pubKeyHash: `0x${convertBech32ToEd25519($selectedAccount.depositAddress)}`,
    }
    $: aliasOutput = address
        ? {
              aliasId: '0x0000000000000000000000000000000000000000000000000000000000000000',
              unlockConditions: [
                  {
                      type: 4, // Governor
                      address,
                  },
                  {
                      type: 5, // State controller
                      address,
                  },
              ],
          }
        : ''

    $: void setStorageDeposit(aliasOutput)

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
            $isTransferring = true
            await $selectedAccount.createAliasOutput()
            closePopup()
        } catch (err) {
            handleError(err)
        } finally {
            $isTransferring = false
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
