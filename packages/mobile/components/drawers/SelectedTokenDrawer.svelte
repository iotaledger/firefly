<script lang="ts">
    import { AssetIcon, Button, FontWeight, KeyValueBox, Text, TextHint, TextType } from '@ui'

    import { localize } from '@core/i18n'
    import {
        getUnitFromTokenMetadata,
        hideActivitiesForHiddenAssets,
        hideAsset,
        IAsset,
        NewTransactionType,
        NotVerifiedStatus,
        TokenStandard,
        unhideAsset,
        unverifyAsset,
        updateNewTransactionDetails,
        VerifiedStatus,
        verifyAsset,
    } from '@core/wallet'

    import { closeDrawer, DrawerId, openDrawer, updateDrawerProps } from '@/auxiliary/drawer'
    import features from '@features/features'

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

    function onVerifyClick(): void {
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
    function onUnverifyClick(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
    }
    function onSkipClick(): void {
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
    function onHideClick(): void {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, hidden: true },
        })
    }
    function onUnhideClick(): void {
        unhideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updateDrawerProps(DrawerId.SelectedToken, {
            asset: { ...asset, hidden: false },
        })
    }
    function onSendClick(): void {
        updateNewTransactionDetails({ type: NewTransactionType.TokenTransfer, asset })
        _closeDrawer()
        openDrawer(DrawerId.Send, { fullScreen: true })
    }
</script>

<token-information class="flex flex-col justify-between h-full space-y-10">
    <token-content class="flex flex-col space-y-8">
        <div class="space-y-3 flex flex-col items-center justify-center">
            <AssetIcon {asset} large />
            <Text type={TextType.h2} fontWeight={FontWeight.bold}>
                {getUnitFromTokenMetadata(asset?.metadata)}
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
                <Button classes="w-full" onClick={onVerifyClick}>
                    {localize('popups.tokenInformation.buttons.verifyToken')}
                </Button>
                <Button outline classes="w-full" onClick={onSkipClick}>
                    {localize('actions.skip')}
                </Button>
            {:else}
                {#if asset?.verification?.status === VerifiedStatus.SelfVerified}
                    <Button outline classes="w-full" onClick={onUnverifyClick}>
                        {localize('actions.unverifyToken')}
                    </Button>
                {:else}
                    <Button outline classes="w-full" onClick={onVerifyClick}>
                        {localize('actions.verifyToken')}
                    </Button>
                {/if}
                {#if asset?.hidden}
                    <Button outline classes="w-full" onClick={onUnhideClick}>
                        {localize('actions.unhideToken')}
                    </Button>
                {:else}
                    <Button outline classes="w-full" onClick={onHideClick}>
                        {localize('actions.hideToken')}
                    </Button>
                {/if}
                <Button classes="w-full" onClick={onSendClick}>
                    {localize('actions.send')}
                </Button>
            {/if}
        </token-actions>
    {/if}
</token-information>
