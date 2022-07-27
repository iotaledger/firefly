<script lang="typescript">
    import { requestTokensFromFaucet } from '@contexts/developer'
    import { BaseError } from '@core/error'
    import { localize } from '@core/i18n'
    import { nodeInfo } from '@core/network'
    import { closePopup } from '@lib/popup'
    import { Button, Error, Spinner, Text } from 'shared/components'
    import { FontWeightText, TextType } from 'shared/components/Text.svelte'

    let isBusy = false
    let error: BaseError

    async function onConfirm(): Promise<void> {
        error = null
        try {
            isBusy = true
            await requestTokensFromFaucet()
            closePopup()
        } catch (reason) {
            error = reason
                ? new BaseError({ message: reason?.error ?? reason?.message ?? reason, logToConsole: true })
                : reason
        } finally {
            isBusy = false
        }
    }

    function onBack(): void {
        closePopup()
    }
</script>

<faucet-request-popup class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeightText.semibold} classes="text-left">
        {localize('popups.faucetRequest.title')}
    </Text>
    <div class="w-full flex-col space-y-2">
        <Text type={TextType.p} classes="text-left">
            {localize('popups.faucetRequest.body', {
                values: { token: $nodeInfo?.baseToken?.name, network: $nodeInfo?.protocol?.networkName },
            })}
        </Text>
        {#if error}
            <Error error={error?.message} />
        {/if}
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" secondary onClick={onBack} disabled={isBusy}>{localize('actions.back')}</Button>
        <Button autofocus classes="w-full" onClick={onConfirm} disabled={isBusy}>
            {#if isBusy}
                <Spinner busy classes="justify-center break-all" />
            {:else}
                {localize('actions.confirm')}
            {/if}
        </Button>
    </popup-buttons>
</faucet-request-popup>
