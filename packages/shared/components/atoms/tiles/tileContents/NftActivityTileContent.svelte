<script lang="typescript">
    import { InclusionState } from '@core/wallet'
    import { truncateString } from '@lib/helpers'
    import { Text, Icon } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { INftActivityData } from '@core/wallet/interfaces/nft-activity-data.interface'
    import { FontWeight } from 'shared/components/enums'

    export let inclusionState: InclusionState
    export let data: INftActivityData
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
    <div class="flex flex-row">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            NFT recieved
        </Text>
    </div>
    <div class="flex flex-row">
        <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
            {truncateString(data?.outputId, 20, 6)}
        </Text>
    </div>
</div>
