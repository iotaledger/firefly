<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, getActivityTileTitle, NftActivity, Subject } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { NftImageOrIconBox, ActivityTileContent } from 'shared/components'
    import { networkHrp } from '@core/network'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

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
    $: subjectLocale = getSubjectLocale(activity.subject)

    $: nft = getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)

    function getSubjectLocale(subject: Subject): string {
        let description
        if (subject?.type === 'account') {
            description = truncateString(subject?.account?.name, 13, 0)
        }
        if (subject?.type === 'address') {
            description = truncateString(subject?.address, $networkHrp.length, 6)
        }
        return description ? description : localize('general.unknownAddress')
    }
</script>

<ActivityTileContent {action} {subject} {formattedAsset}>
    <NftImageOrIconBox slot="icon" nftId={activity.nftId} size="medium" />
</ActivityTileContent>
