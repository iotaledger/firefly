<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, InclusionState, INftActivityData, Subject } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { Text, FontWeight, NftMediaContainer, NftMediaSize } from 'shared/components'
    import { networkHrp } from '@core/network'

    export let inclusionState: InclusionState
    export let data: INftActivityData

    $: isIncoming = data.direction === ActivityDirection.Incoming
    $: title = getTitle(data, inclusionState)
    $: subjectLocale = getSubjectLocale(data.subject)

    function getTitle(txData: INftActivityData, inclusionState: InclusionState): string {
        const { isInternal, direction } = txData
        const isConfirmed = inclusionState === InclusionState.Confirmed

        if (isInternal) {
            return isConfirmed ? 'general.transferNft' : 'general.transferringNft'
        }
        if (direction === ActivityDirection.Incoming) {
            return isConfirmed ? 'general.receivedNft' : 'general.receivingNft'
        }
        if (direction === ActivityDirection.Outgoing) {
            return isConfirmed ? 'general.sentNft' : 'general.sendingNft'
        }
    }

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
    <NftMediaContainer nftId={data.nftId} size={NftMediaSize.Small} />
</div>

<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row items-start">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {localize(title)}
        </Text>
    </div>

    <div class="flex flex-row items-start">
        <Text fontWeight={FontWeight.normal} lineHeight="140" color="gray-600">
            {localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                values: { account: subjectLocale },
            })}
        </Text>
    </div>
</div>
