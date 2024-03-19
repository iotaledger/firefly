<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant, KeyValueBox } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { burnAsset, formatTokenAmountBestMatch, getDefaultTransactionOptions, IAsset } from '@core/wallet'
    import { checkActiveProfileAuth } from '@core/profile'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { selectedWallet } from '@core/wallet'
    import { TextHintVariant } from '@ui/enums'
    import { PreparedTransaction } from '@iota/sdk/out/types'
    import { ManaBox } from '@components'

    export let asset: IAsset
    export let rawAmount: string
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    let preparedTransaction: PreparedTransaction
    let hasEnoughMana = false

    $: formattedAmount = formatTokenAmountBestMatch(Number(rawAmount), asset?.metadata)

    function onBackClick(): void {
        openPopup({
            id: PopupId.BurnNativeTokens,
            props: { asset, rawAmount },
        })
    }

    async function onBurnTokenClick(): Promise<void> {
        try {
            await checkActiveProfileAuth(
                async () => {
                    await burnAsset(asset.id, rawAmount)
                    closePopup()
                },
                { stronghold: true }
            )
        } catch (err) {
            console.error(err)
        }
    }

    async function prepareBurnFoundryTransaction(): Promise<void> {
        if (asset && $selectedWallet && rawAmount) {
            preparedTransaction = await $selectedWallet.prepareBurnNativeToken(
                asset.id,
                BigInt(rawAmount),
                getDefaultTransactionOptions()
            )
        }
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareBurnFoundryTransaction()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmTokenBurn.title', {
            values: {
                assetName: asset?.metadata.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <KeyValueBox keyText={localize('popups.nativeToken.property.assetId')} valueText={asset.id} isCopyable />
        <KeyValueBox keyText={localize('general.amount')} valueText={formattedAmount} />
        <TextHint variant={TextHintVariant.Warning} text={localize('actions.confirmTokenBurn.hint')} />
        <ManaBox {preparedTransaction} bind:hasEnoughMana />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onBackClick}>{localize('actions.back')}</Button>
        <Button
            classes="w-full"
            variant={ButtonVariant.Warning}
            isBusy={$selectedWallet?.isTransferring}
            disabled={$selectedWallet?.isTransferring || !hasEnoughMana}
            onClick={onBurnTokenClick}
        >
            {localize('actions.burnToken')}
        </Button>
    </popup-buttons>
</div>
