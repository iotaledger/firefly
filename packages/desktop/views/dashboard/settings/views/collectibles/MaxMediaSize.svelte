<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { TextType } from '@ui/enums'

    import { selectedWalletId } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        addNftsToDownloadQueue,
        DownloadWarningType,
        INft,
        persistedNftForActiveProfile,
        selectedWalletNfts,
        updateNftInAllAccountNfts,
    } from '@core/nfts'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import type { IDropdownItem } from '@core/utils'

    function onMaxMediaSizeChange(option: IDropdownItem<number>): void {
        const maxMediaSizeInMegaBytes = option.value

        updateActiveProfileSettings({ maxMediaSizeInMegaBytes })

        const maxMediaSizeInBytes = maxMediaSizeInMegaBytes && maxMediaSizeInMegaBytes * 1024 * 1024
        deleteOrDownloadNfts(maxMediaSizeInBytes)
    }

    function assignMaxMediaSizeOptionLabel(amount: number): string {
        return amount ? amount + ' MB' : localize('general.none')
    }

    function maxMediaSizeOptions(): IDropdownItem<number>[] {
        return [5, 10, 25, 50, 100, undefined].map((amount) => ({
            value: amount,
            label: assignMaxMediaSizeOptionLabel(amount),
        }))
    }

    async function deleteOrDownloadNfts(maxMediaSizeInBytes: number): Promise<void> {
        const nftsToDownload: INft[] = []
        const nftsToDelete: INft[] = []

        Object.keys($persistedNftForActiveProfile ?? {}).forEach((nftId) => {
            const nft = $selectedWalletNfts.find((nft) => nft.id === nftId)
            if (!nft) {
                return
            }

            if (!maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }

            const nftSizeInBytes = Number($persistedNftForActiveProfile?.[nftId]?.contentLength)

            if (nftSizeInBytes > maxMediaSizeInBytes) {
                nftsToDelete.push(nft)
            } else if (nftSizeInBytes <= maxMediaSizeInBytes) {
                nftsToDownload.push(nft)
            }
        })

        addNftsToDownloadQueue($selectedWalletId, nftsToDownload, true)
        await Promise.all(
            nftsToDelete.map(async (nft) => {
                await Platform.deleteFile(nft.filePath)
                updateNftInAllAccountNfts($selectedWalletId, nft.id, {
                    downloadMetadata: { isLoaded: false, warning: { type: DownloadWarningType.TooLargeFile } },
                })
            })
        )
    }
</script>

<Text type={TextType.h4} classes="mb-3">
    {localize('views.settings.maxMediaSize.title')}
</Text>
<Text type={TextType.p} secondary classes="mb-5">
    {localize('views.settings.maxMediaSize.description')}
</Text>
<Dropdown
    value={$activeProfile?.settings.maxMediaSizeInMegaBytes}
    items={maxMediaSizeOptions()}
    onSelect={onMaxMediaSizeChange}
/>
