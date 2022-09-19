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
    import { updatePopupProps } from '@lib/popup'
    import { HR, MenuItem, Modal } from 'shared/components'

    export let modal: Modal
    export let asset: IAsset

    const handleUnverify = () => {
        unverifyAsset(asset.id, NotVerifiedStatus.Skipped)
        updatePopupProps({
            asset: { ...asset, verification: { verified: false, status: NotVerifiedStatus.Skipped } },
        })
        modal.close()
    }

    function handleVerify() {
        verifyAsset(asset.id, VerifiedStatus.SelfVerified)
        updatePopupProps({
            asset: { ...asset, verification: { verified: true, status: VerifiedStatus.SelfVerified } },
        })
        modal.close()
    }

    const handleUnhide = () => {
        unhideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: false },
        })
        modal.close()
    }

    function handleHide() {
        hideAsset(asset.id)
        hideActivitiesForHiddenAssets()
        updatePopupProps({
            asset: { ...asset, hidden: true },
        })
        modal.close()
    }

    function handleBurnToken(): void {
        modal.close()
    }
</script>

<Modal bind:this={modal}>
    <div class="flex flex-col">
        {#if asset?.verification?.status === VerifiedStatus.SelfVerified}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.unverifyToken')}
                onClick={handleUnverify}
                first
            />
        {:else}
            <MenuItem
                icon={Icon.NotVerified}
                iconProps={{ secondaryColor: 'white' }}
                title={localize('actions.verifyToken')}
                onClick={handleVerify}
                first
            />
        {/if}
        {#if asset?.hidden}
            <MenuItem icon={Icon.View} title={localize('actions.unhideToken')} onClick={handleUnhide} first />
        {:else}
            <MenuItem icon={Icon.Hide} title={localize('actions.hideToken')} onClick={handleHide} first />
        {/if}
        <HR />
        <MenuItem
            icon={Icon.Delete}
            title={localize('actions.burnToken')}
            onClick={handleBurnToken}
            first
            last
            disabled={true}
        />
    </div>
</Modal>
