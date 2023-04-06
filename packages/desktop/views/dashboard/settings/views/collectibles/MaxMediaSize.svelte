<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { TextType } from '@ui/enums'

    import { selectedAccountIndex } from '@core/account/stores'
    import { Platform } from '@core/app'
    import { localize } from '@core/i18n'
    import { addNftsToDownloadQueue, INft, persistedNftForActiveProfile, selectedAccountNfts } from '@core/nfts'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import type { IDropdownChoice } from '@core/utils'

    function updateMediaSizeLimit(option): void {
        const maxMediaSizeInMegaBytes = option.value

        updateActiveProfileSettings({ maxMediaSizeInMegaBytes })

        const maxMediaSizeInBytes = maxMediaSizeInMegaBytes && maxMediaSizeInMegaBytes * 1024 * 1024
        deleteOrDownloadNfts(maxMediaSizeInBytes)
    }

    function assignMaxMediaSizeOptionLabel(amount: number): string {
        return amount ? amount + ' MB' : 'None'
    }

    function maxSizeOptions(): IDropdownChoice[] {
        return [5, 10, 25, 50, 100, undefined].map((amount) => ({
            value: amount,
            label: amount ? amount + ' MB' : 'None',
        }))
    }

    async function deleteOrDownloadNfts(maxMediaSizeInBytes: number): Promise<void> {
        const nftsToDownload: INft[] = []
        const nftsToDelete: INft[] = []

        Object.keys($persistedNftForActiveProfile ?? {}).forEach((nftId) => {
            const nft = $selectedAccountNfts.find((nft) => nft.id === nftId)
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

        addNftsToDownloadQueue($selectedAccountIndex, nftsToDownload)
        await Promise.all(
            nftsToDelete.map((nft) => {
                Platform.deleteFile(nft.filePath)
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
    onSelect={updateMediaSizeLimit}
    value={assignMaxMediaSizeOptionLabel($activeProfile?.settings.maxMediaSizeInMegaBytes)}
    items={maxSizeOptions()}
/>
