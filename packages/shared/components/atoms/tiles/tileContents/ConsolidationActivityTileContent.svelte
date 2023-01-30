<script lang="typescript">
    import { localize } from '@core/i18n'
    import { ConsolidationActivity, getActivityTileTitle } from '@core/wallet'
    import { ActivityTileContent } from 'shared/components'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: ConsolidationActivity

    $: title = localize(getActivityTileTitle(activity))
</script>

<ActivityTileContent icon={Icon.Currency} {title} subtitle={localize('general.internalTransaction')} />
