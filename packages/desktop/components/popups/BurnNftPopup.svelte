<script lang="ts">
    import { Button, Text, TextHint, FontWeight, TextType, ButtonVariant } from '@ui'
    import { localize } from '@core/i18n'
    import { closePopup } from '@auxiliary/popup'
    import { handleError } from '@core/error/handlers'
    import { onMount } from 'svelte'
    import { burnNft, getDefaultTransactionOptions, selectedWallet } from '@core/wallet'
    import { TextHintVariant } from '@ui/enums'
    import { INft } from '@core/nfts'
    import { ITransactionInfoToCalculateManaCost } from '@core/network'
    import { checkActiveProfileAuth } from '@core/profile'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { ManaBox } from '@components'

    export let nft: INft
    export let _onMount: (..._: any[]) => Promise<void> = async () => {}

    const transactionInfo: ITransactionInfoToCalculateManaCost = {}

    let isBusy = false
    let hasEnoughMana = false

    async function prepareBurnNftTransaction(): Promise<void> {
        try {
            transactionInfo.preparedTransaction = await $selectedWallet.prepareBurnNft(
                nft.id,
                getDefaultTransactionOptions()
            )
        } catch (error) {
            transactionInfo.preparedTransactionError = error
        }
    }

    async function onBurnNftClick(): Promise<void> {
        try {
            isBusy = true
            await checkActiveProfileAuth(
                async () => {
                    await burnNft(nft.id)
                    $collectiblesRouter.goTo(CollectiblesRoute.Gallery)
                    closePopup()
                },
                { stronghold: true }
            )
        } catch (err) {
            handleError(err)
        } finally {
            isBusy = false
        }
    }

    function onCancelClick(): void {
        closePopup()
    }

    onMount(async () => {
        try {
            await _onMount()
            await prepareBurnNftTransaction()
        } catch (err) {
            handleError(err)
        }
    })
</script>

<div class="w-full h-full space-y-6 flex flex-auto flex-col shrink-0">
    <Text type={TextType.h3} fontWeight={FontWeight.semibold} classes="text-left">
        {localize('actions.confirmNftBurn.title', {
            values: {
                nftName: nft.name,
            },
        })}
    </Text>
    <div class="space-y-4">
        <Text fontSize="14" classes="text-left break-words">{localize('actions.confirmNftBurn.description')}</Text>
        <ManaBox {transactionInfo} bind:hasEnoughMana refreshTransactionInfo={prepareBurnNftTransaction} />
        <TextHint variant={TextHintVariant.Warning} text={localize('actions.confirmNftBurn.hint')} />
    </div>
    <popup-buttons class="flex flex-row flex-nowrap w-full space-x-4">
        <Button classes="w-full" outline onClick={onCancelClick}>{localize('actions.cancel')}</Button>
        <Button
            classes="w-full"
            variant={ButtonVariant.Warning}
            disabled={$selectedWallet?.isTransferring || isBusy || !hasEnoughMana}
            isBusy={$selectedWallet?.isTransferring || isBusy}
            onClick={onBurnNftClick}
        >
            {localize('actions.burn')}
        </Button>
    </popup-buttons>
</div>
