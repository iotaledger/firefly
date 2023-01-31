<script lang="typescript">
    import { localize } from '@core/i18n'
    import { AliasActivity, getActivityTileTitle } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { ActivityTileContent } from 'shared/components'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: AliasActivity

    $: action = localize(getActivityTileTitle(activity))
    $: formattedAsset = {
        text: truncateString(activity.aliasId, 5, 3),
        color: 'blue-700',
    }
</script>

<ActivityTileContent icon={Icon.Alias} {action} subject={localize('general.internalTransaction')} {formattedAsset} />
