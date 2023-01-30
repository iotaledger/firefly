<script lang="typescript">
    import { localize } from '@core/i18n'
    import { AliasActivity, getActivityTileTitle } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { ActivityTileContent } from 'shared/components'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: AliasActivity

    $: title = localize(getActivityTileTitle(activity))
</script>

<ActivityTileContent icon={Icon.Alias} {title} subtitle={truncateString(activity.aliasId, 20, 6)} />
