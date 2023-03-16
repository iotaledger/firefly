<script lang="ts">
    import { MenuItem, Modal } from 'shared/components'

    import { openUrlInBrowser, time } from '@core/app'
    import { localize } from '@core/i18n'
    import { INft } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'

    import { PopupId } from '@auxiliary/popup'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'

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

    function onOpenMediaClick(): void {
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
            onClick={onOpenMediaClick}
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
