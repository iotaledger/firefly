<script lang="ts">
    import { AssetAmountInput, Button, TextHint } from '@ui'

    import { localize } from '@core/i18n'
    import { isStrongholdUnlocked } from '@core/profile-manager'
    import { burnAsset, formatTokenAmountBestMatch, IAsset } from '@core/wallet'

    import { closeAllDrawers, DrawerId, openDrawer } from '@/auxiliary/drawer'

    export let asset: IAsset

    let rawAmount: string = '0'
    let assetAmountInput: AssetAmountInput

    async function onContinueClick(): Promise<void> {
        try {
            await assetAmountInput.validate()

            const _onConfirm = async (): Promise<void> => {
                const isUnlocked = await isStrongholdUnlocked()
                if (isUnlocked) {
                    await burnAsset(asset.id, rawAmount)
                    closeAllDrawers()
                } else {
                    openDrawer(DrawerId.EnterPassword, { onSuccess: _onConfirm })
                }
            }

            openDrawer(DrawerId.Confirm, {
                title: localize('actions.confirmTokenBurn.title', {
                    values: {
                        assetName: asset?.metadata?.name,
                    },
                }),
                hint: localize('actions.confirmTokenBurn.hint'),
                description: `${localize('general.amount')}: ${formatTokenAmountBestMatch(
                    Number(rawAmount),
                    asset?.metadata
                )}`,
                warning: true,
                danger: true,
                confirmText: localize('actions.burnToken'),
                onConfirm: _onConfirm,
            })
        } catch (err) {
            console.error(err)
        }
    }
</script>

<burn-native-tokens-drawer class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <div class="space-y-4">
        <AssetAmountInput bind:this={assetAmountInput} bind:rawAmount {asset} containsSlider disableAssetSelection />
        <TextHint warning text={localize('actions.confirmTokenBurn.hint')} />
    </div>

    <Button classes="w-full" onClick={onContinueClick}>{localize('actions.continue')}</Button>
</burn-native-tokens-drawer>
