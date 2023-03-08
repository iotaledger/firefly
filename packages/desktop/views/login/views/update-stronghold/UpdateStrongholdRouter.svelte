<script lang="ts">
    import { UpdateStrongholdView } from './views'
    import { UpdateStrongholdRoute } from '@core/router/enums/login'
    import { updateStrongholdRoute } from '@core/router/subrouters/login'
</script>

{#if $updateStrongholdRoute === UpdateStrongholdRoute.Update}
    <UpdateStrongholdView />
{/if}
