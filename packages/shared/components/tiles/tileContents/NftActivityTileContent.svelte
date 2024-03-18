<script lang="ts">
    import { selectedWalletId } from '@core/wallet'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllWalletNfts } from '@core/nfts'
    import { ActivityNft } from '@core/wallet/types'
    import { ActivityTileContent, NftImageOrIconBox } from '@ui'

    export let activity: ActivityNft

    $: isIncoming =
        activity.isIncoming()
    $: action = localize(activity.tileTitle())
    $: subject = localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
        values: { address: subjectLocale },
    })
    $: formattedAsset = {
        text: nft?.name ?? '',
        color: isIncoming ? 'blue-700' : '',
        classes: 'truncate',
    }
    $: subjectLocale = activity.subject()

    $: nft = getNftByIdFromAllWalletNfts($selectedWalletId, activity.nftId())
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <NftImageOrIconBox slot="icon" {nft} />
</ActivityTileContent>
