<script lang="typescript">
    import { KeyValueBox } from 'shared/components'

    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts, IIrc27Metadata } from '@core/nfts'
    import { Activity, NftActivity } from '@core/wallet'
    import { selectedAccountIndex } from '@core/account'

    export let activity: Partial<Activity> = {}

    type NftMetadataDetailsList = {
        [key in keyof IIrc27Metadata]: {
            data: unknown
            isTooltipVisible?: boolean
        }
    }

    $: storedNft = getNftByIdFromAllAccountNfts($selectedAccountIndex, (activity as NftActivity)?.nftId)
    $: nftMetadataDetailsList = createNftMetadataDetailsList(storedNft?.parsedMetadata)

    function createNftMetadataDetailsList(
        metadata: IIrc27Metadata | string
    ): NftMetadataDetailsList | { metadata: { data: string } } {
        if (typeof metadata === 'string') {
            return { metadata: { data: metadata } }
        }
        return createIrc27NftMetadataDetailsList(metadata)
    }

    function createIrc27NftMetadataDetailsList(metadata: IIrc27Metadata): NftMetadataDetailsList {
        return {
            ...(metadata?.standard && {
                standard: { data: metadata.standard, isTooltipVisible: true },
            }),
            ...(metadata?.version && {
                version: { data: metadata.version },
            }),
            ...(metadata?.name && {
                name: { data: metadata.name },
            }),
            ...(metadata?.type && {
                type: { data: metadata.type as string, isTooltipVisible: true },
            }),
            ...(metadata?.uri && {
                uri: { data: metadata.uri },
            }),
            ...(metadata?.collectionId && {
                collectionId: { data: metadata.collectionId, isTooltipVisible: true },
            }),
            ...(metadata?.collectionName && {
                collectionName: { data: metadata.collectionName },
            }),
            ...(metadata?.royalties && {
                royalties: { data: metadata.royalties, isTooltipVisible: true },
            }),
            ...(metadata?.issuerName && {
                issuerName: { data: metadata.issuerName, isTooltipVisible: true },
            }),
            ...(metadata?.description && {
                description: { data: metadata.description },
            }),
            ...(metadata?.attributes && {
                attributes: { data: metadata.attributes, isTooltipVisible: true },
            }),
        }
    }
</script>

{#each Object.entries(nftMetadataDetailsList) as [key, value]}
    <KeyValueBox
        keyText={nftMetadataDetailsList[key].isTooltipVisible
            ? localize(`tooltips.transactionDetails.nftMetadata.${key}`)
            : ''}
        valueText={JSON.stringify(value, null, 2)}
        classes="whitespace-pre-wrap"
        isCopyable
    />
{/each}
