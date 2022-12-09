<script lang="typescript">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant, KeyValueBox } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup'
    import { burnAsset, formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile'

    export let asset: IAsset
    export let rawAmount: string

    $: formattedAmount = formatTokenAmountBestMatch(Number(rawAmount), asset.metadata)

    function onBack(): void {
        openPopup({
            type: 'burnNativeTokens',
            props: { asset, rawAmount },
        })
    }

    function confirmClick(): void {
        try {
            checkActiveProfileAuth(async () => {
                await burnAsset(asset.id, rawAmount)
                closePopup()
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
                assetName: asset.metadata.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <KeyValueBox keyText={localize('popups.nativeToken.property.assetId')} valueText={asset.id} isCopyable />
        <KeyValueBox keyText={localize('general.amount')} valueText={formattedAmount} />
        <TextHint warning text={localize('actions.confirmTokenBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBack}>{localize('actions.back')}</Button>
        <Button classes="w-full" variant={ButtonVariant.Warning} onClick={confirmClick}>
            {localize('actions.burnToken')}
        </Button>
    </popup-buttons>
</div>
