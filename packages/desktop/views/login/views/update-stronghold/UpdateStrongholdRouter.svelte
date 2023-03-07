<script lang="ts">
    import { UpdateStrongholdView, UpdateBackupView } from './views'
    import { UpdateStrongholdRoute } from '@core/router/enums/login'
    import { updateStrongholdRoute } from '@core/router/subrouters/login'
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <UpdateStrongholdView />
{:else if $updateStrongholdRoute === UpdateStrongholdRoute.SaveBackup}
    <UpdateBackupView />
{/if}
