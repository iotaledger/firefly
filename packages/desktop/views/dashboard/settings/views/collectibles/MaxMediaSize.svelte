<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { TextType } from '@ui/enums'

    import { localize } from '@core/i18n'
    import {
        addNftsToDeleteQueue,
        addNftsToDownloadQueue,
        persistedNftForActiveProfile,
        selectedAccountNfts,
    } from '@core/nfts'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownChoice } from '@core/utils'
    import { selectedAccountIndex } from '@core/account'

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

    function deleteOrDownloadNfts(maxMediaSizeInBytes: number): void {
        const nftsToDownload = []
        const nftsToDelete = []

        Object.keys($persistedNftForActiveProfile).forEach((nftId) => {
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
        addNftsToDeleteQueue($selectedAccountIndex, nftsToDelete)
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
