<script lang="ts">
    import { localize } from '@core/i18n'
    import { truncateString } from '@core/utils'
    import { ActivityTileContent } from '@ui'
    import { Icon } from '@lib/auxiliary/icon'
    import { ActivityAccount } from 'shared/lib/core/wallet'

    export let activity: ActivityAccount

    $: action = localize(activity.tileTitle())
    $: formattedAsset = {
        text: truncateString(activity.accountAddress(), 6, 6),
        color: 'blue-700',
    }
</script>

<ActivityTileContent icon={Icon.Account} {action} subject={localize('general.internalTransaction')} {formattedAsset} />
