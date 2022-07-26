<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        hideAsset,
        IAsset,
        selectedAccountAssets,
        unhideAsset,
        unverifyAsset,
        VerificationStatus,
        verifyAsset,
    } from '@core/wallet'
    import { Icon } from '@lib/auxiliary/icon'
    import { updatePopupProps } from '@lib/popup'
    import { HR, MenuItem, Modal } from 'shared/components'
    import { get } from 'svelte/store'

    export let modal: Modal
    export let asset: IAsset

    const handleUnverify = () => {
        unverifyAsset(asset.id)
        updatePopupProps({
            asset: get(selectedAccountAssets)?.nativeTokens?.find((nativeToken) => nativeToken.id === asset.id),
        })
        modal.close()
    }

    function handleVerify() {
        verifyAsset(asset.id)
        updatePopupProps({
            asset: get(selectedAccountAssets)?.nativeTokens?.find((nativeToken) => nativeToken.id === asset.id),
        })
        modal.close()
    }

    const handleUnhide = () => {
        unhideAsset(asset.id)
        updatePopupProps({
            asset: get(selectedAccountAssets)?.nativeTokens?.find((nativeToken) => nativeToken.id === asset.id),
        })
        modal.close()
    }

    function handleHide() {
        hideAsset(asset.id)
        updatePopupProps({
            asset: get(selectedAccountAssets)?.nativeTokens?.find((nativeToken) => nativeToken.id === asset.id),
        })
        modal.close()
    }

    function handleBurnToken(): void {
        modal.close()
    }
</script>

<Modal bind:this={modal} position={{ top: '52px', right: '24px' }}>
    <div class="flex flex-col">
        {#if asset?.verification === VerificationStatus.Verified}
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
