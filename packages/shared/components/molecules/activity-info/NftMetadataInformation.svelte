<script lang="typescript">
    import { KeyValueBox } from 'shared/components'

    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts, IIrc27Metadata } from '@core/nfts'
    import { NftActivity } from '@core/wallet'
    import { selectedAccountIndex } from '@core/account'

    export let activity: NftActivity
    export let nftMetadata: IIrc27Metadata | string = undefined

    type NftMetadataDetailsList = {
        [key in keyof IIrc27Metadata]?: {
            data: unknown
            isTooltipVisible?: boolean
        }
    }

    $: storedNft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
    $: nftMetadataDetailsList = createNftMetadataDetailsList(
        storedNft?.parsedMetadata ?? storedNft?.metadata ?? nftMetadata
    )

    function createNftMetadataDetailsList(
        metadata: IIrc27Metadata | string
    ): NftMetadataDetailsList | { metadata: { data: string } } {
        if (typeof metadata === 'string') {
            let formattedMetadata: string
            try {
                formattedMetadata = JSON.stringify(JSON.parse(metadata), null, '\t')
            } catch (e) {
                formattedMetadata = metadata
            }

            return { metadata: { data: formattedMetadata } }
        }
        return createIrc27NftMetadataDetailsList(metadata)
    }

    function createIrc27NftMetadataDetailsList(metadata: IIrc27Metadata): NftMetadataDetailsList {
        return {
            ...(metadata.standard && {
                standard: { data: metadata.version ? `${metadata.standard} - ${metadata.version}` : standard },
            }),
            ...(metadata?.type && {
                type: { data: metadata.type as string, isTooltipVisible: true },
            }),
            ...(metadata?.uri && {
                uri: { data: metadata.uri },
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
        classes={key === 'metadata' ? 'whitespace-pre-wrap' : ''}
        isCopyable
    />
{/each}
