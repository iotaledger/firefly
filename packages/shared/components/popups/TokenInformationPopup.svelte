<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAsset, TokenVerificationStatus } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { openPopup } from '@lib/popup'
    import { Button, KeyValueBox, Text, TextHint } from 'shared/components'
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
        {asset?.metadata?.verification === TokenVerificationStatus.NewToken
            ? localize('popups.tokenInformation.unverifiedTitle')
            : asset?.metadata?.name}
    </Text>

    <div class="space-y-4">
        {#if asset?.metadata?.verification !== TokenVerificationStatus.Verified}
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
            <KeyValueBox
                keyText={localize('popups.tokenInformation.tokenMetadata.url')}
                valueText={asset?.metadata?.url}
            />
        </div>
    </div>

    <div class="flex flex-row flex-nowrap w-full space-x-4">
        {#if asset?.metadata?.verification === TokenVerificationStatus.NewToken}
            <Button secondary classes="w-full" onClick={handleSkip}>
                {localize('popups.tokenInformation.buttons.skipVerification')}
            </Button>
            <Button autofocus classes="w-full" onClick={handleVerify}>
                {localize('popups.tokenInformation.buttons.verifyToken')}
            </Button>
        {:else}
            <Button classes="w-full" onClick={handleSend}>
                {localize('popups.tokenInformation.buttons.send')}
            </Button>
        {/if}
    </div>
</div>
