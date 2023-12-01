<script lang="ts">
    import { selectedWalletId } from '@core/wallet
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { ActivityDirection } from '@core/wallet/enums'
    import { getActivityTileTitle, getSubjectLocaleFromActivity } from '@core/wallet/utils'
    import { NftActivity } from '@core/wallet/types'
    import { ActivityTileContent, NftImageOrIconBox } from 'shared/components'

    export let activity: NftActivity

    $: isIncoming =
        activity.direction === ActivityDirection.Incoming || activity.direction === ActivityDirection.SelfTransaction
    $: action = localize(getActivityTileTitle(activity))
    $: subject = localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
        values: { account: subjectLocale },
    })
    $: formattedAsset = {
        text: nft?.name ?? '',
        color: isIncoming ? 'blue-700' : '',
        classes: 'truncate',
    }
    $: subjectLocale = getSubjectLocaleFromActivity(activity)

    $: nft = getNftByIdFromAllAccountNfts($selectedWalletId, activity.nftId)
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <NftImageOrIconBox slot="icon" {nft} />
</ActivityTileContent>
