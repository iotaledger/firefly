<script lang="typescript">
    import { Pane, AccountActivity } from 'shared/components'
    import featureFlags from 'shared/featureFlags.config'
</script>

<Pane>
    {#if featureFlags?.wallet?.activityHistory?.enabled}
        <AccountActivity />
    {/if}
</Pane>
