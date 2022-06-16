<script lang="typescript">
    import { Pane, AccountActivity } from 'shared/components'
    import features from 'shared/features/features'
</script>

<Pane>
    {#if features?.wallet?.activityHistory?.enabled}
        <AccountActivity />
    {/if}
</Pane>
