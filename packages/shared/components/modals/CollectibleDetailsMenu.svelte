<script lang="typescript">
    import { Modal, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { burnNft } from '@core/wallet'
    import { INft } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { openUrlInBrowser } from '@core/app'

    export let modal: Modal = undefined
    export let nft: INft

    function openBurnNft(): void {
        openPopup({
            type: 'confirmation',
            props: {
                title: localize('actions.confirmNftBurn.title', {
                    values: {
                        nftName: nft.name,
                    },
                }),
                description: localize('actions.confirmNftBurn.description'),
                hint: localize('actions.confirmNftBurn.hint'),
                warning: true,
                confirmText: localize('actions.burnToken'),
                onConfirm: () => {
                    checkActiveProfileAuth(
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
        openUrlInBrowser(nft.parsedMetadata.uri)
    }
</script>

<Modal bind:this={modal} position={{ top: '100px', right: '60px' }}>
    <div class="flex flex-col">
        <MenuItem icon="receive" title={localize('views.collectibles.details.menu.download')} first />
        <MenuItem icon="profile" title={localize('views.collectibles.details.menu.setAvatar')} />
        <MenuItem
            icon="export"
            title={localize('views.collectibles.details.menu.view')}
            disabled={!nft.parsedMetadata?.uri}
            onClick={handleOpenMediaClick}
        />
        <MenuItem icon="delete" title={localize('views.collectibles.details.menu.burn')} onClick={openBurnNft} />
    </div>
</Modal>
