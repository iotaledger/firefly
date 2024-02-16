<script lang="ts">
    import { selectedWalletId } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { convertAndFormatNftMetadata, getNftByIdFromAllWalletNfts, IIrc27Metadata } from '@core/nfts'
    import { NftActivity } from '@core/wallet'
    import { KeyValueBox } from '@ui'

    export let activity: NftActivity

    type NftMetadataDetailsList = {
        [key in keyof IIrc27Metadata]?: {
            data: unknown
            isTooltipVisible?: boolean
            copyValue?: string
            isCopyable?: boolean
            isPreText?: boolean
            maxHeight?: number
        }
    }

    $: nft = getNftByIdFromAllWalletNfts($selectedWalletId, activity?.nftId)
    $: nftMetadataDetailsList = nft?.parsedMetadata
        ? createIrc27NftMetadataDetailsList(nft?.parsedMetadata)
        : createNftMetadataDetailsList(nft?.metadata)

    function createNftMetadataDetailsList(metadata: string): {
        metadata: { data: string; copyValue?: string; isCopyable?: boolean; isPreText?: boolean; maxHeight: number }
    } {
        const data = convertAndFormatNftMetadata(metadata)
        return { metadata: { data, isCopyable: true, isPreText: true, maxHeight: 48 } }
    }

    function createIrc27NftMetadataDetailsList(metadata: IIrc27Metadata): NftMetadataDetailsList {
        return {
            ...(metadata.standard && {
                standard: {
                    data: metadata.version ? `${metadata.standard} - ${metadata.version}` : metadata?.standard,
                },
            }),
            ...(metadata?.type && {
                type: { data: metadata.type as string, isTooltipVisible: true },
            }),
            ...(metadata?.uri && {
                uri: { data: metadata.uri, isCopyable: true },
            }),
            ...(metadata?.issuerName && {
                issuerName: { data: metadata.issuerName, isTooltipVisible: true },
            }),
            ...(metadata?.collectionName && {
                collectionName: { data: metadata.collectionName },
            }),
        }
    }
</script>

{#each Object.entries(nftMetadataDetailsList) as [key, value]}
    <KeyValueBox
        keyText={localize(`general.${key}`)}
        valueText={value.data}
        tooltipText={value.isTooltipVisible ? localize(`tooltips.transactionDetails.nftMetadata.${key}`) : undefined}
        isPreText={value.isPreText}
        isCopyable={value.isCopyable}
        maxHeight={value.maxHeight}
    />
{/each}
