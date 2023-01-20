<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ConsolidationActivity, getActivityTileTitle } from '@core/wallet'
    import { Text, Icon, FontWeight } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let activity: ConsolidationActivity

    $: title = getActivityTileTitle(activity)
</script>

<div class="relative flex w-8 h-8">
    <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
        <Icon
            icon={IconEnum.Currency}
            width="83.33333%"
            height="83.33333%"
            classes="text-white dark:text-gray-800 text-center"
        />
    </div>
</div>
<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row justify-between space-x-1">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {localize(title)}
        </Text>
    </div>
    <div class="flex flex-row justify-between">
        <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
            {localize('general.internalTransaction')}
        </Text>
    </div>
</div>
