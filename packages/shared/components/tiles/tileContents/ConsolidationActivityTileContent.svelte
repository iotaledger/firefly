<script lang="ts">
    import { localize } from '@core/i18n'
    import { ConsolidationActivity, getActivityTileTitle } from '@core/wallet'
    import { ActivityTileContent } from 'shared/components'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: ConsolidationActivity

    $: action = localize(getActivityTileTitle(activity))
</script>

<ActivityTileContent icon={Icon.Currency} {action} subject={localize('general.internalTransaction')} />
