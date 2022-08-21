<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IActivity, IAsset, unverifyAsset, VerificationStatus, verifyAsset } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { openPopup, updatePopupProps } from '@lib/popup'
    import { AssetIcon, Button, Text, TextHint, AssetActionsButton, KeyValueBox } from 'shared/components'
    import { FontWeight } from '../Text.svelte'

    export let asset: IAsset
    export let activity: IActivity

    function handleSkip() {
        unverifyAsset(asset.id)
        if (activity) {
            openPopup({
                type: 'activityDetails',
                props: { activity },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: VerificationStatus.NotVerified },
            })
        }
    }

    function handleVerify() {
        verifyAsset(asset.id)
        if (activity) {
            openPopup({
                type: 'activityDetails',
                props: { activity },
            })
        } else {
            updatePopupProps({
                asset: { ...asset, verification: VerificationStatus.Verified },
            })
        }
    }

    function handleSend() {
        openPopup({
            type: 'sendForm',
            overflow: true,
            props: {
                asset,
            },
        })
    }
</script>

<div class="space-y-6">
    <div class="flex flex-row items-center space-x-3 mr-16">
        <Text
            type="h4"
            fontSize="18"
            lineHeight="6"
            fontWeight={FontWeight.semibold}
            classes="overflow-hidden whitespace-nowrap overflow-ellipsis"
        >
            {asset?.verification === VerificationStatus.New
                ? localize('popups.tokenInformation.newTokenTitle')
                : asset?.metadata?.name}
        </Text>
        {#if asset?.standard === 'IRC30'}
            <AssetActionsButton {asset} />
        {/if}
    </div>

    <div class="space-y-3 flex flex-col items-center justify-center">
        <AssetIcon {asset} large showVerificationBadge />
        <Text type="h2" fontWeight={FontWeight.bold}>
            {asset?.metadata?.tickerSymbol ?? asset?.metadata?.unit}
        </Text>
    </div>

    <div class="space-y-4 flex flex-col items-center justify-center">
        {#if asset?.verification !== VerificationStatus.Verified}
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
                valueText={truncateString(asset?.id, 18, 18, 3)}
                isCopyable={asset?.standard === 'IRC30'}
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
        {#if asset?.verification === VerificationStatus.New}
            <Button secondary classes="w-full" onClick={handleSkip}>
                {localize('actions.skip')}
            </Button>
            <Button autofocus classes="w-full" onClick={handleVerify}>
                {localize('popups.tokenInformation.buttons.verifyToken')}
            </Button>
        {:else}
            <Button classes="w-full" onClick={handleSend}>
                {localize('actions.send')}
            </Button>
        {/if}
    </div>
</div>
