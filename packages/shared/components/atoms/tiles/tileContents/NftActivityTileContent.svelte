<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, getActivityTileTitle, NftActivity, Subject } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { Text, FontWeight, NftMediaContainer, NftMediaSize } from 'shared/components'
    import { networkHrp } from '@core/network'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

    export let activity: NftActivity

    $: isIncoming =
        activity.direction === ActivityDirection.Incoming || activity.direction === ActivityDirection.SelfTransaction
    $: title = getActivityTileTitle(activity)
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

<div class="relative flex w-8 h-8">
    <NftMediaContainer nftId={activity.nftId} size={NftMediaSize.Small} />
</div>

<div class="flex flex-col w-full space-y-0.5 overflow-hidden">
    <div class="flex flex-row justify-between space-x-4">
        <Text fontWeight={FontWeight.semibold} lineHeight="140" classes="flex-shrink-0">
            {localize(title)}
        </Text>
        <Text fontWeight={FontWeight.semibold} lineHeight="140" color={isIncoming ? 'blue-700' : ''} classes="truncate">
            {nft?.name ?? ''}
        </Text>
    </div>

    <div class="flex flex-row items-start" style="width: 70%">
        <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600" classes="truncate">
            {localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                values: { account: subjectLocale },
            })}
        </Text>
    </div>
</div>
