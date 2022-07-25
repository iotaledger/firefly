<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAsset, VerificationStatus } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { Button, KeyValueBox, Text, TextHint, AssetIcon } from 'shared/components'
    import { FontWeightText } from '../Text.svelte'

    export let asset: IAsset

    function handleSkip() {}

    function handleVerify() {}

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
    <Text type="h4" fontSize="18" lineHeight="6" fontWeight={FontWeightText.semibold}>
        {asset?.verification === VerificationStatus.New
            ? localize('popups.tokenInformation.newTokenTitle')
            : asset?.metadata?.name}
    </Text>
    <div class="space-y-4 flex flex-col items-center justify-center">
        <AssetIcon {asset} large showVerificationBadge />
        {#if asset?.verification !== VerificationStatus.Verified}
            <TextHint warning text={localize('popups.tokenInformation.verificationWarning')} />
        {/if}
        <div class="w-full flex-col space-y-2">
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.name')}
                valueText={asset?.metadata?.name}
            />
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.tokenId')}
                valueText={truncateString(asset?.id, 15, 15, 3)}
            />
            {#if asset?.metadata?.url}
                <KeyValueBox
                    keyText={localize('popups.tokenInformation.tokenMetadata.url')}
                    valueText={asset?.metadata?.url}
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

<style type="text/css">
    #star8 {
        @apply bg-gray-600;
        width: 10px;
        height: 10px;
        position: relative;
        -webkit-transform: rotate(20deg);
        -moz-transform: rotate(20deg);
        -ms-transform: rotate(20deg);
        -o-transform: rotate(20eg);
    }
    #star8:before {
        @apply bg-gray-600;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 10px;
        width: 10px;
        -webkit-transform: rotate(135deg);
        -moz-transform: rotate(135deg);
        -ms-transform: rotate(135deg);
        -o-transform: rotate(135deg);
    }
</style>
