<script lang="ts">
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { Button, Text, FontWeight, TextType, NumberInput, TextInput } from '@ui'
    import { handleError } from '@core/error/handlers'
    import { DEFAULT_MANA, getManaBalance } from '@core/network'
    import { formatTokenAmountBestMatch, selectedWallet } from '@core/wallet'

    let isBusy = false
    let account: string = ''
    let error: string
    let amountError: string
    let amount: string
    const availableMana = getManaBalance($selectedWallet?.balances?.mana?.available)
    $: availableManaFormatted = formatTokenAmountBestMatch(availableMana, DEFAULT_MANA, false)

    function onConfirmClick(): void {
        error = null
        try {
            closePopup()
        } catch (err) {
            error = err.error
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onBackClick(): void {
        closePopup()
    }
</script>

<allot-mana-popup class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.allotMana.title')}
    </Text>
    <div class="w-full flex-col space-y-4">
        <Text type={TextType.p} classes="text-left">
            {localize('popups.allotMana.body')}
        </Text>
        <available-mana-row class="flex flex-row space-x-2">
            <Text type={TextType.p} classes="text-left">
                {localize('popups.allotMana.availableMana')}
            </Text>
            <Text type={TextType.p} classes="text-left" fontWeight={FontWeight.semibold}>
                {availableManaFormatted}
            </Text>
        </available-mana-row>
        <NumberInput
            error={amountError}
            bind:value={amount}
            placeholder={localize('filters.amount.label')}
            label={localize('filters.amount.label')}
            disabled={isBusy}
            isInteger={false}
        />
        <TextInput
            {error}
            bind:value={account}
            placeholder={localize('general.accountAddress')}
            submitHandler={onConfirmClick}
            disabled={isBusy}
        />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick} disabled={isBusy}>{localize('actions.back')}</Button>
        <Button classes="w-full" onClick={onConfirmClick} disabled={isBusy} {isBusy}>
            {localize('actions.send')}
        </Button>
    </popup-buttons>
</allot-mana-popup>
