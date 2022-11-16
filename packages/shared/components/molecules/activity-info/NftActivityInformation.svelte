<script lang="typescript">
    import { KeyValueBox } from 'shared/components'

    import { selectedAccountIndex } from '@core/account'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { getBech32AddressFromAddressTypes, NftActivity } from '@core/wallet'

    export let activity: NftActivity

    $: storedNft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)

    let detailsList: { [key in string]: string }
    $: detailsList = {
        nftId: activity?.nftId,
        immutableIssuer: getBech32AddressFromAddressTypes(storedNft?.issuer),
    }
</script>

{#each Object.entries(detailsList) as [key, value]}
    <KeyValueBox keyText={localize(`general.${key}`)} valueText={value} isCopyable />
{/each}
