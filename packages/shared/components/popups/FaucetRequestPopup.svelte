<script lang="typescript">
    import { requestTokensFromFaucet } from '@contexts/developer'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { closePopup } from '@auxiliary/popup'
    import { Button, Error, Text, FontWeight, TextType } from 'shared/components'
    import { handleError } from '@core/error/handlers/handleError'

    let isBusy = false
    let error: string

    async function onConfirm(): Promise<void> {
        error = null
        try {
            isBusy = true
            await requestTokensFromFaucet()
            closePopup()
        } catch (err) {
            error = err.error
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onBack(): void {
        closePopup()
    }
</script>

<faucet-request-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('popups.faucetRequest.title')}
    </Text>
    <div class="w-full flex-col space-y-2">
        <Text type={TextType.p} classes="text-left">
            {localize('popups.faucetRequest.body', {
                values: { token: $nodeInfo?.baseToken?.name, network: $nodeInfo?.protocol?.networkName },
            })}
        </Text>
        {#if error}
            <Error {error} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBack} disabled={isBusy}>{localize('actions.back')}</Button>
        <Button classes="w-full" onClick={onConfirm} disabled={isBusy} {isBusy}>
            {localize('actions.confirm')}
        </Button>
    </popup-buttons>
</faucet-request-popup>
