<script lang="ts">
    import { selectedWalletId } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllWalletNfts } from '@core/nfts'
    import { IKeyValueBoxList } from '@core/utils'
    import { getBech32AddressFromAddressTypes, getHexAddressFromAddressTypes, NftActivity } from '@core/wallet'
    import { KeyValueBox } from '@ui'
    import { AddressType } from '@iota/sdk/out/types'

    export let activity: NftActivity

    $: nft = getNftByIdFromAllWalletNfts($selectedWalletId, activity.nftId)
    $: issuerAddress = nft?.issuer && getBech32AddressFromAddressTypes(nft.issuer)
    $: collectionId = nft?.issuer && getHexAddressFromAddressTypes(nft.issuer)

    let detailsList: IKeyValueBoxList
    $: detailsList = {
        nftId: { data: activity?.nftId, isCopyable: true },
        ...(nft?.issuer?.type === AddressType.Ed25519 && {
            issuerAddress: { data: issuerAddress, isCopyable: true },
        }),
        ...((nft?.issuer?.type === AddressType.Nft || nft?.issuer?.type === AddressType.Account) && {
            collectionId: { data: collectionId, isCopyable: true },
        }),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    {#if value}
        <KeyValueBox keyText={localize(`general.${key}`)} valueText={value.data} isCopyable={value?.isCopyable} />
    {/if}
{/each}
