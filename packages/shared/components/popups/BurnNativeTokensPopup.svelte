<script lang="typescript">
    import {
        Button,
        Text,
        TextHint,
        FontWeight,
        TextType,
        ButtonVariant,
        AssetAmountSliderInput,
    } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { burnAsset, IAsset } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile'

    export let asset: IAsset

    let rawAmount = '0'
    function confirmClick(): void {
        checkActiveProfileAuth(async () => {
            await burnAsset(asset.id)
            closePopup()
        })
    }
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmTokenBurn.title', {
            values: {
                assetName: asset.metadata.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <AssetAmountSliderInput bind:rawAmount {asset} />
        <TextHint warning text={localize('actions.confirmTokenBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={closePopup}>{localize('actions.cancel')}</Button>
        <Button classes="w-full" variant={ButtonVariant.Warning} onClick={confirmClick}>
            {localize('actions.burnToken')}
        </Button>
    </popup-buttons>
</div>
