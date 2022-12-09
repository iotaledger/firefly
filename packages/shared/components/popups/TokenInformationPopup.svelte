<script lang="typescript">
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
    import { openPopup, updatePopupProps } from '@auxiliary/popup'
    import { AssetIcon, Button, Text, TextHint, AssetActionsButton, KeyValueBox, FontWeight } from 'shared/components'

    export let asset: IAsset
    export let activityId: string = undefined

    function onSkipClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        if (activityId) {
            openPopup({
                type: 'activityDetails',
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
                type: 'activityDetails',
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
            assetId: asset.id,
            disableAssetSelection: true,
        })
        openPopup({
            type: 'sendForm',
            overflow: true,
        })
    }
</script>

<div class="space-y-6">
    <div class="flex flex-row justify-between items-center space-x-3 mr-8">
        <Text
            type="h4"
            fontSize="18"
            lineHeight="6"
            fontWeight={FontWeight.semibold}
            classes="overflow-hidden whitespace-nowrap overflow-ellipsis"
        >
            {asset?.verification?.status === NotVerifiedStatus.New
                ? localize('popups.tokenInformation.newTokenTitle')
                : asset?.metadata?.name}
        </Text>
        {#if asset?.standard === TokenStandard.Irc30}
            <AssetActionsButton {asset} />
        {/if}
    </div>

    <div class="space-y-3 flex flex-col items-center justify-center">
        <AssetIcon {asset} large showVerifiedBadgeOnly />
        <Text type="h2" fontWeight={FontWeight.bold}>
            {asset?.metadata?.tickerSymbol ?? asset?.metadata?.unit}
        </Text>
    </div>

    <div class="space-y-4 flex flex-col items-center justify-center">
        {#if !asset?.verification?.verified}
            <TextHint warning text={localize('popups.tokenInformation.verificationWarning')} />
        {/if}
        <div class="w-full flex flex-col space-y-2">
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.standard')}
                valueText={asset?.standard}
            />
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.name')}
                valueText={asset?.metadata?.name}
            />
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.tokenId')}
                valueText={asset?.id}
                isCopyable={asset?.standard === TokenStandard.Irc30}
                copyValue={asset?.id}
            />
            {#if asset?.metadata?.url}
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.url')}
                    valueText={asset?.metadata?.url}
                    isCopyable
                />
            {/if}
        </div>
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        {#if asset?.verification?.status === NotVerifiedStatus.New}
            <Button outline classes="w-full" onClick={onSkipClick}>
                {localize('actions.skip')}
            </Button>
            <Button classes="w-full" onClick={onVerifyClick}>
                {localize('popups.tokenInformation.buttons.verifyToken')}
            </Button>
        {:else}
            <Button classes="w-full" onClick={onSendClick}>
                {localize('actions.send')}
            </Button>
        {/if}
    </div>
</div>
