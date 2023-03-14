<script lang="ts">
    import { Modal, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { burnNft } from '@core/wallet'
    import { INft } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { openUrlInBrowser, time } from '@core/app'
    import { PopupId } from '@auxiliary/popup'

    export let modal: Modal = undefined
    export let nft: INft

    $: isLocked = nft.timelockTime > $time.getTime()

    function openBurnNft(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.confirmNftBurn.title', {
                    values: {
                        nftName: nft.name,
                    },
                }),
                description: localize('actions.confirmNftBurn.description'),
                hint: localize('actions.confirmNftBurn.hint'),
                warning: true,
                confirmText: localize('actions.burn'),
                onConfirm: async () => {
                    await checkActiveProfileAuth(
                        async () => {
                            await burnNft(nft.id)
                            $collectiblesRouter.goTo(CollectiblesRoute.Gallery)
                            closePopup()
                        },
                        { stronghold: true }
                    )
                },
            },
        })
    }

    function handleOpenMediaClick(): void {
        openUrlInBrowser(nft.composedUrl)
    }
</script>

<Modal bind:this={modal} position={{ top: '100px', right: '60px' }}>
    <div class="flex flex-col">
        <MenuItem icon="receive" title={localize('views.collectibles.details.menu.download')} disabled={true} />
        <MenuItem icon="profile" title={localize('views.collectibles.details.menu.setAvatar')} disabled={true} />
        <MenuItem
            icon="export"
            title={localize('views.collectibles.details.menu.view')}
            onClick={handleOpenMediaClick}
            disabled={!nft?.composedUrl}
        />
        <MenuItem
            icon="delete"
            title={localize('views.collectibles.details.menu.burn')}
            onClick={openBurnNft}
            disabled={isLocked}
        />
    </div>
</Modal>
