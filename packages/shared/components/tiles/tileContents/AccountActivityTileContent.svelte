<script lang="ts">
    import { localize } from '@core/i18n'
    import { AccountActivity, getActivityTileTitle } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { ActivityTileContent } from '@ui'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: AccountActivity

    $: action = localize(getActivityTileTitle(activity))
    $: formattedAsset = {
        text: truncateString(activity.accountAddress, 6, 6),
        color: 'blue-700',
    }
</script>

<ActivityTileContent icon={Icon.Account} {action} subject={localize('general.internalTransaction')} {formattedAsset} />
