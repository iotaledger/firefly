<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ActivityDirection, InclusionState, INftActivityData, Subject } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { Text, FontWeight, Icon } from 'shared/components'
    import { networkHrp } from '@core/network'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let inclusionState: InclusionState
    export let data: INftActivityData

    $: isIncoming = data.direction === ActivityDirection.Incoming
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
    <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
        <Icon
            icon={IconEnum.Collectibles}
            width="83.33333%"
            height="83.33333%"
            classes="text-white dark:text-gray-800 text-center"
        />
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
            {localize(isIncoming ? 'general.fromAddress' : 'general.toAddress', {
                values: { account: subjectLocale },
            })}
        </Text>
    </div>
</div>
