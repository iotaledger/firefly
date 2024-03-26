<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        TokenStandard,
        IAsset,
        resetNewTokenTransactionDetails,
        updateNewTransactionDetails,
        unverifyAsset,
        verifyAsset,
        NotVerifiedStatus,
        VerifiedStatus,
        NewTransactionType,
    } from '@core/wallet'
    import { openPopup, PopupId, updatePopupProps } from '@auxiliary/popup'
    import {
        Button,
        Text,
        TextHint,
        AssetTile,
        KeyValueBox,
        FontWeight,
        TextType,
        AssetActionsModal,
        MeatballMenuButton,
        Modal,
    } from '@ui'
    import { TextHintVariant } from '@ui/enums'
    import { MANA_ID } from '@core/network'
    import BalanceSummarySection from '@ui/BalanceSummarySection.svelte'

    export let asset: IAsset
    export let activityId: string = undefined

    const balanceSummary = getBalanceSummary()

    let modal: Modal

    function onSkipClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
            })
        }
    }

    function onVerifyClick(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        if (activityId) {
            openPopup({
                id: PopupId.ActivityDetails,
                props: { activityId },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
            })
        }
    }

    function onSendClick(): void {
        resetNewTokenTransactionDetails()
        updateNewTransactionDetails({
            type: NewTransactionType.TokenTransfer,
            asset: asset,
            disableAssetSelection: true,
        })
        openPopup({
            id: PopupId.SendForm,
            overflow: true,
        })
    }

    function getBalanceSummary(): { amount: number; details?: { [key: string]: { amount: number } } } {
        const totalBalance = asset?.balance?.total

        const details = {
            available: { amount: asset?.balance?.available },
            conditionallyLocked: { amount: asset?.balance?.total - asset?.balance?.available },
        }
        return { amount: totalBalance, details }
    }
</script>

{#if asset}
    <div class="space-y-6 max-h-xl scrollable-y">
        <div class="flex flex-row justify-between items-center space-x-3 mr-8">
            <Text
                type={TextType.h4}
                fontSize="18"
                lineHeight="6"
                fontWeight={FontWeight.semibold}
                classes="overflow-hidden whitespace-nowrap text-ellipsis"
            >
                {asset.verification?.status === NotVerifiedStatus.New
                    ? localize('popups.tokenInformation.newTokenTitle')
                    : asset.metadata?.name}
            </Text>
            {#if asset.standard === TokenStandard.Irc30}
                <div class="max-h-7 max-w-9 overflow-visible relative">
                    <MeatballMenuButton onClick={modal?.toggle} />
                    <AssetActionsModal bind:modal {asset} position={{ right: '0' }} classes="mt-1.5" />
                </div>
            {/if}
        </div>

        <AssetTile classes="pointer-events-none" onClick={() => {}} {asset} />

        <div class="space-y-4 flex flex-col items-center justify-center">
            {#if !asset.verification?.verified}
                <TextHint
                    variant={TextHintVariant.Warning}
                    text={localize('popups.tokenInformation.verificationWarning')}
                />
            {/if}
            <div class="w-full flex flex-col space-y-2">
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.standard')}
                    valueText={asset.standard}
                />
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.name')}
                    valueText={asset.metadata?.name}
                />
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.tokenId')}
                    valueText={asset.id}
                    isCopyable={asset.standard === TokenStandard.Irc30}
                    copyValue={asset.id}
                />
                {#if asset.metadata?.standard === TokenStandard.Irc30 && asset.metadata.url}
                    <KeyValueBox
                        keyText={localize('popups.tokenInformation.tokenMetadata.url')}
                        valueText={asset.metadata.url}
                        isCopyable
                    />
                {/if}
                <balance-wrapper class="flex flex-col bg-gray-50 dark:bg-gray-850 px-4 py-4 rounded-lg">
                    <BalanceSummarySection
                        {asset}
                        titleKey="asset"
                        subtitleKey="asset"
                        amount={balanceSummary?.amount}
                        subBreakdown={balanceSummary?.details}
                    />
                </balance-wrapper>
            </div>
        </div>
        <div class="flex flex-row flex-nowrap w-full space-x-4">
            {#if asset.verification?.status === NotVerifiedStatus.New}
                <Button outline classes="w-full" onClick={onSkipClick}>
                    {localize('actions.skip')}
                </Button>
                <Button classes="w-full" onClick={onVerifyClick}>
                    {localize('popups.tokenInformation.buttons.verifyToken')}
                </Button>
            {:else}
                <Button classes="w-full" onClick={onSendClick} disabled={asset.id === MANA_ID}>
                    {localize('actions.send')}
                </Button>
            {/if}
        </div>
    </div>
{/if}
