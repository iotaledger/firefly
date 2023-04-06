<script lang="ts">
    import { selectedAccountIndex } from '@core/account'
    import { localize } from '@core/i18n'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { truncateString } from '@core/utils'
    import { ActivityDirection } from '@core/wallet/enums'
    import { getSubjectFromActivity, getActivityTileTitle } from '@core/wallet/utils'
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
    $: subjectLocale = getSubjectLocale(activity)

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)

    function getSubjectLocale(activity: NftActivity): string {
        const subject = getSubjectFromActivity(activity)
        if (subject?.type === 'account') {
            return truncateString(subject?.account?.name, 13, 0)
        } else if (subject?.type === 'address') {
            return truncateString(subject?.address, 6, 6)
        } else {
            return localize('general.unknownAddress')
        }
    }
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <NftImageOrIconBox slot="icon" nftId={activity.nftId} size="medium" />
</ActivityTileContent>
