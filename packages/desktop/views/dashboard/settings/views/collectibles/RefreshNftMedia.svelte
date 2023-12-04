<script lang="ts">
    import { Button, Text, ButtonSize, TextType } from 'shared/components'
    import { localize } from '@core/i18n'
    import { closePopup, openPopup, PopupId } from '@auxiliary/popup'
    import {
        addNftsToDownloadQueue,
        selectedWalletNfts,
        stopDownloadingNftMediaFromQueue,
        updateNftInAllAccountNfts,
    } from '@core/nfts'
    import { Platform } from '@core/app'
    import { selectedWalletId } from '@core/wallet'

    let isLoading = false

    function onRefreshClick(): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('actions.refreshNftMedia.title'),
                description: localize('actions.refreshNftMedia.description'),
                onConfirm: () => {
                    refreshNftMedia()
                    closePopup()
                },
            },
        })
    }

    async function refreshNftMedia(): Promise<void> {
        isLoading = true
        try {
            await stopDownloadingNftMediaFromQueue()
            await Promise.all(
                $selectedWalletNfts.map(async (nft) => {
                    await Platform.deleteFile(nft.filePath)
                    updateNftInAllAccountNfts($selectedWalletId, nft.id, {
                        downloadMetadata: { isLoaded: false },
                    })
                })
            )
            addNftsToDownloadQueue($selectedWalletId, $selectedWalletNfts, true)
        } finally {
            isLoading = false
        }
    }
</script>

<Text type={TextType.h4} classes="mb-3">{localize('views.settings.refreshNftMedia.title')}</Text>
<Text secondary classes="mb-5">{localize('views.settings.refreshNftMedia.description')}</Text>
<div class="flex flex-row items-center">
    <Button
        size={ButtonSize.Medium}
        inlineStyle="min-width: 156px;"
        isBusy={isLoading}
        disabled={isLoading}
        onClick={onRefreshClick}
    >
        {localize('actions.refresh')}
    </Button>
</div>
