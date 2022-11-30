<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        hideAsset,
        IAsset,
        unhideAsset,
        unverifyAsset,
        verifyAsset,
        hideActivitiesForHiddenAssets,
        NotVerifiedStatus,
        VerifiedStatus,
    } from '@core/wallet'
    import { Icon } from '@lib/auxiliary/icon'
    import { openPopup, updatePopupProps } from '@auxiliary/popup'
    import { MenuItem, Modal } from 'shared/components'
    import features from '@features/features'

    export let modal: Modal = undefined
    export let asset: IAsset

    function handleUnverify(): void {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        updatePopupProps({
            asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
        modal.close()
    }

    function handleVerify(): void {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        updatePopupProps({
            asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
        })
        modal.close()
    }

    function handleUnhide(): void {
        unhideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: false },
        })
        modal.close()
    }

    function handleHide(): void {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: true },
        })
        modal.close()
    }

    function handleBurnToken(): void {
        modal.close()
        openPopup({ type: 'burnNativeTokens', props: { asset } })
    }
</script>

<Modal bind:this={modal} {...$$restProps}>
    <div class="flex flex-col">
        {#if asset?.verification?.status === VerifiedStatus.SelfVerified}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.unverifyToken')}
                onClick={handleUnverify}
            />
        {:else}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.verifyToken')}
                onClick={handleVerify}
            />
        {/if}
        {#if asset?.hidden}
            <MenuItem icon={Icon.View} title={localize('actions.unhideToken')} onClick={handleUnhide} />
        {:else}
            <MenuItem icon={Icon.Hide} title={localize('actions.hideToken')} onClick={handleHide} />
        {/if}
        <MenuItem
            icon={Icon.Delete}
            disabled={!features?.wallet?.assets?.burnAsset?.enabled}
            title={localize('actions.burnToken')}
            onClick={handleBurnToken}
        />
    </div>
</Modal>
