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
    import { TextHintVariant } from 'shared/components/enums'
    import { Icon as IconEnum } from '@auxiliary/icon'

    export let modal: Modal
    export let nft: INft

    $: url = nft?.parsedMetadata?.uri && composeUrl(nft.parsedMetadata.uri)
    $: isLocked = nft.timelockTime > $time.getTime()
    $: isCurrentPfp = $activeProfile.pfp?.id === nft.id

    $: MENU_ITEMS = [
        {
            icon: IconEnum.Receive,
            title: localize('views.collectibles.details.menu.download'),
            disabled: true,
            onClick: (): void => {},
        },
        {
            icon: IconEnum.Profile,
            title: localize(`views.collectibles.details.menu.${isCurrentPfp ? 'unsetPfp' : 'setPfp'}`),
            onClick: onSetPfpClick,
        },
        {
            icon: IconEnum.Export,
            title: localize('views.collectibles.details.menu.view'),
            onClick: onOpenMediaClick,
            disabled: !url,
        },
        {
            icon: IconEnum.Delete,
            title: localize('views.collectibles.details.menu.burn'),
            onClick: openBurnNft,
            disabled: isLocked,
        },
    ]

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
                variant: TextHintVariant.Warning,
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
    {#each MENU_ITEMS as item}
        <MenuItem {...item} />
    {/each}
</Modal>
