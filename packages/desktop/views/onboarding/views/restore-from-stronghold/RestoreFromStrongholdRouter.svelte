<script lang="ts">
    import { Transition } from 'shared/components'
    import { RestoreFromStrongholdRoute } from './restore-from-stronghold-route.enum'
    import { restoreFromStrongholdRoute } from './restore-from-stronghold-router'
    import { ImportStrongholdView, UnlockStrongholdView } from './views'
</script>

{#if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.ImportStronghold}
    <Transition>
        <ImportStrongholdView />
    </Transition>
{:else if $restoreFromStrongholdRoute === RestoreFromStrongholdRoute.UnlockStronghold}
    <Transition>
        <UnlockStrongholdView />
    </Transition>
{/if}
