<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, InclusionState, INftActivityData, Subject } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { Text, FontWeight } from 'shared/components'
    import { networkHrp } from '@core/network'

    export let inclusionState: InclusionState
    export let data: INftActivityData

    $: title = getTitle(data, inclusionState)
    $: subjectLocale = getSubjectLocale(data.subject)

    function getTitle(txData: INftActivityData, inclusionState: InclusionState): string {
        const { isInternal, direction } = txData
        const isInclusionStateConfirmed = inclusionState === InclusionState.Confirmed

        if (isInternal) {
            return isInclusionStateConfirmed ? 'general.transferNft' : 'general.transferringNft'
        }
        if (direction === ActivityDirection.Incoming) {
            return isInclusionStateConfirmed ? 'general.receivedNft' : 'general.receivingNft'
        }
        if (direction === ActivityDirection.Outgoing) {
            return isInclusionStateConfirmed ? 'general.sentNft' : 'general.sendingNft'
        }
    }

    function getSubjectLocale(subject: Subject): string {
        if (subject?.type === 'account') {
            return truncateString(subject?.account?.name, 13, 0)
        }
        if (subject?.type === 'address') {
            return truncateString(subject?.address, $networkHrp.length, 6)
        }
        return localize('general.unknownAddress')
    }
</script>

<div class="relative flex w-6 h-6">
    <div class="rounded-full flex justify-center items-center transition-none p-1 w-6 h-6 bg-blue-500">
        <p style="font-size: 12px;" class="transition-none font-600 text-blue-500 text-center">NFT</p>
    </div>
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
            {subjectLocale}
        </Text>
    </div>
</div>
