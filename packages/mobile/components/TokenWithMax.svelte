<script lang="typescript">
    import { localize } from '@core/i18n'
    import { truncateString } from '@core/utils'
    import { formatTokenAmountBestMatch, IAsset } from '@core/wallet'
    import { AssetIcon, Button, ButtonSize, FontWeight, Text, TextType } from 'shared/components'

    export let asset: IAsset
    export let onMaxClick: () => unknown
</script>

<div class="w-full flex flex-row justify-between items-center">
    <div class="flex flex-row items-center text-left space-x-4">
        <AssetIcon {asset} />
        <div class="flex flex-col">
            <Text type={TextType.p} fontWeight={FontWeight.semibold}>
                {asset?.metadata?.name ? truncateString(asset?.metadata?.name, 13, 0) : truncateString(asset?.id, 6, 7)}
            </Text>
            <div class="flex flex-row justify-between items-center text-left">
                <Text type={TextType.p} secondary smaller>
                    {localize('general.availableAmount', {
                        values: {
                            amount: formatTokenAmountBestMatch(asset?.balance.total, asset?.metadata),
                        },
                    })}
                </Text>
                <slot name="subLabel" />
            </div>
        </div>
    </div>
    <div class="flex flex-col">
        <Button outline size={ButtonSize.Small} onClick={onMaxClick}>{localize('actions.max')}</Button>
    </div>
</div>
