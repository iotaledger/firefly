<script lang="ts">
    import { localize } from '@core/i18n'
    import { IAsset, NotVerifiedStatus, TokenStandard } from '@core/wallet'
    import features from '@features/features'
    import { AssetIcon, Button, FontWeight, KeyValueBox, Text, TextHint, TextType } from 'shared/components'

    import {
        hideActivitiesForHiddenAssets,
        hideAsset,
        NewTransactionType,
        unverifyAsset,
        updateNewTransactionDetails,
        VerifiedStatus,
        verifyAsset,
    } from '@core/wallet'
    import { closeDrawer, DrawerId, openDrawer, updateDrawerProps } from '../../lib/auxiliary/drawer'

    export let asset: IAsset
    export let activityId: string = undefined

    $: drawerTitle =
        asset?.verification?.status === NotVerifiedStatus.New
            ? localize('popups.tokenInformation.newTokenTitle')
            : asset?.metadata?.name
    $: drawerTitle, updateDrawerProps(DrawerId.SelectedToken, { title: drawerTitle })

    function _closeDrawer(): void {
        closeDrawer(DrawerId.SelectedToken)
    }

    function handleVerify(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        if (activityId) {
            _closeDrawer()
            openDrawer(DrawerId.SelectedActivity, { activityId })
        } else {
            updateDrawerProps(DrawerId.SelectedToken, {
                asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
            })
        }
    }
    function handleUnverify(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
    }
    function handleSkip(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        if (activityId) {
            _closeDrawer()
            openDrawer(DrawerId.SelectedActivity, { activityId })
        } else {
            updateDrawerProps(DrawerId.SelectedToken, {
                asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
            })
        }
    }
    function handleHide(): void {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, hidden: true },
        })
    }
    function handleUnhide(): void {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, hidden: false },
        })
    }
    function handleSend(): void {
        updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, assetId: asset.id })
        _closeDrawer()
        openDrawer(DrawerId.Send)
    }
</script>

<token-information class="flex flex-col justify-between h-full space-y-10">
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
    </token-content>
    {#if features.dashboard.tokens.actions.enabled}
        <token-actions class="space-y-4">
            {#if asset?.verification?.status === NotVerifiedStatus.New}
                <Button classes="w-full" onClick={handleVerify}>
                    {localize('popups.tokenInformation.buttons.verifyToken')}
                </Button>
                <Button outline classes="w-full" onClick={handleSkip}>
                    {localize('actions.skip')}
                </Button>
            {:else}
                {#if asset?.verification?.status === VerifiedStatus.SelfVerified}
                    <Button outline classes="w-full" onClick={handleUnverify}>
                        {localize('actions.unverifyToken')}
                    </Button>
                {:else}
                    <Button outline classes="w-full" onClick={handleVerify}>
                        {localize('actions.verifyToken')}
                    </Button>
                {/if}
                {#if asset?.hidden}
                    <Button outline classes="w-full" onClick={handleUnhide}>
                        {localize('actions.unhideToken')}
                    </Button>
                {:else}
                    <Button outline classes="w-full" onClick={handleHide}>
                        {localize('actions.hideToken')}
                    </Button>
                {/if}
                <Button classes="w-full" onClick={handleSend}>
                    {localize('actions.send')}
                </Button>
            {/if}
        </token-actions>
    {/if}
</token-information>
