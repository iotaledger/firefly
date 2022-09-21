<script lang="typescript">
    import { Transition } from 'shared/components'
    import { EnterNameView, SetupClaimedView, SetupNewView, SetupRecoveredView, SetupView } from './views'
    import { ProfileSetupRoute, profileSetupRoute } from '@core/router'
</script>

{#if $profileSetupRoute === ProfileSetupRoute.Setup}
    <Transition>
        <SetupView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.SetupClaimed}
    <Transition>
        <SetupClaimedView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.SetupNew}
    <Transition>
        <SetupNewView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.SetupRecovered}
    <Transition>
        <SetupRecoveredView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.EnterName}
    <Transition>
        <EnterNameView />
    </Transition>
{/if}
