<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        IAsset,
        NewTransactionType,
        NotVerifiedStatus,
        TokenStandard,
        unverifyAsset,
        updateNewTransactionDetails,
        VerifiedStatus,
        verifyAsset,
    } from '@core/wallet'
    import features from '@features/features'
    import { AssetIcon, Button, FontWeight, KeyValueBox, Text, TextHint, TextType } from 'shared/components'

    export let asset: IAsset
    export let onVerify: () => unknown = () => {}
    export let onSkip: () => unknown = () => {}
    export let onSend: () => unknown = () => {}

    function onSkipClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        onSkip()
    }

    function onVerifyClick(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        onVerify()
    }

    function onSendClick(): void {
        updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: asset.id })
        onSend()
    }
</script>

<token-information class="flex flex-col justify-between h-full pt-10">
    <token-content class="flex flex-col space-y-8">
        <div class="space-y-3 flex flex-col items-center justify-center">
            <AssetIcon {asset} large showVerifiedBadgeOnly />
            <Text type={TextType.h2} fontWeight={FontWeight.bold}>
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
                    isCopyable={asset?.standard === TokenStandard.IRC30}
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
    </token-content>

    <token-actions class="space-y-4">
        {#if asset?.verification?.status === NotVerifiedStatus.New && features.dashboard.tokens.actions.enabled}
            <Button classes="w-full" onClick={onVerifyClick}>
                {localize('popups.tokenInformation.buttons.verifyToken')}
            </Button>
            <Button outline classes="w-full" onClick={onSkipClick}>
                {localize('actions.skip')}
            </Button>
        {:else}
            <Button classes="w-full" onClick={onSendClick}>
                {localize('actions.send')}
            </Button>
        {/if}
    </token-actions>
</token-information>
