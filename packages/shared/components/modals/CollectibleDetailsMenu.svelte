<script lang="typescript">
    import { Modal, MenuItem } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup } from '@auxiliary/popup/actions'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { burnNft } from '@core/wallet'
    import { INft, rewriteIpfsUri } from '@core/nfts'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { openUrlInBrowser } from '@core/app'

    export let modal: Modal = undefined
    export let nft: INft

    $: url = composeUrl(nft?.parsedMetadata?.uri)

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

    function composeUrl(targetUrl: string): string {
        if (!targetUrl) {
            return undefined
        }
        const url = new URL(targetUrl)

        switch (url.protocol) {
            case 'http:':
                return targetUrl.replace('http:', 'https:')
            case 'https:':
                return targetUrl
            case 'ipfs:':
                return rewriteIpfsUri(targetUrl)
            default:
                return undefined
        }
    }

    function handleOpenMediaClick(): void {
        openUrlInBrowser(url)
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
            disabled={!url}
        />
        <MenuItem icon="delete" title={localize('views.collectibles.details.menu.burn')} onClick={openBurnNft} />
    </div>
</Modal>
