<script lang="ts">
    import { MenuItem, Modal } from '@ui'
    import { openUrlInBrowser, time } from '@core/app'
    import { localize } from '@core/i18n'
    import { INft, rewriteIpfsUri } from '@core/nfts'
    import { checkActiveProfileAuth } from '@core/profile/actions'
    import { CollectiblesRoute, collectiblesRouter } from '@core/router'
    import { burnNft } from '@core/wallet'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import { activeProfile, updateActiveProfile } from '@core/profile/stores'

    export let modal: Modal = undefined
    export let nft: INft

    $: url = nft?.parsedMetadata?.uri && composeUrl(nft.parsedMetadata.uri)
    $: isLocked = nft.timelockTime > $time.getTime()
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

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

    function composeUrl(targetUrl: string): string | undefined {
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

    function onSetPfpClick(): void {
        updateActiveProfile({
            pfp: isCurrentPfp ? undefined : nft,
        })
    }

    function onOpenMediaClick(): void {
        if (url) {
            openUrlInBrowser(url)
        }
    }
</script>

<Modal bind:this={modal} position={{ top: '100px', right: '60px' }}>
    <div class="flex flex-col">
        <MenuItem
            icon="receive"
            title={localize('views.collectibles.details.menu.download')}
            disabled={true}
            onClick={() => {}}
        />
        <MenuItem
            icon="profile"
            title={localize(`views.collectibles.details.menu.${isCurrentPfp ? 'unsetPfp' : 'setPfp'}`)}
            onClick={onSetPfpClick}
        />
        <MenuItem
            icon="export"
            title={localize('views.collectibles.details.menu.view')}
            onClick={onOpenMediaClick}
            disabled={!url}
        />
        <MenuItem
            icon="delete"
            title={localize('views.collectibles.details.menu.burn')}
            onClick={openBurnNft}
            disabled={isLocked}
        />
    </div>
</Modal>
