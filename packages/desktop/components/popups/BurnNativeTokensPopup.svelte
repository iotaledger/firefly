<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, AssetAmountInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup, PopupId } from '@desktop/auxiliary/popup'
    import { IAsset } from '@core/wallet'

    export let asset: IAsset
    export let rawAmount: string = '0'

    let assetAmountInput: AssetAmountInput

    async function onContinueClick(): Promise<void> {
        try {
            await assetAmountInput.validate()
            openPopup({
                id: PopupId.BurnNativeTokensConfirmation,
                props: { asset, rawAmount },
            })
        } catch (err) {
            console.error(err)
        }
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmTokenBurn.title', {
            values: {
                assetName: asset?.metadata?.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:rawAmount {asset} containsSlider disableAssetSelection />
        <TextHint warning text={localize('actions.confirmTokenBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" onClick={onContinueClick}>{localize('actions.continue')}</Button>
    </popup-buttons>
</div>
