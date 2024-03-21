<script lang="ts">
    import { localize } from '@core/i18n'
    import { ActivityConsolidation } from '@core/wallet'
    import { ActivityTileContent } from '@ui'
    import { Icon } from '@lib/auxiliary/icon'

    export let activity: ActivityConsolidation

    $: action = localize(activity.tileTitle())
</script>

<ActivityTileContent icon={Icon.Currency} {action} subject={localize('general.internalTransaction')} />
