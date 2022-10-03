<script lang="typescript">
    import { Transition } from 'shared/components'
    import { EnterNameView, SetupNewView, SetupView } from './views'
    import { ProfileSetupRoute, profileSetupRoute } from '@core/router'
</script>

{#if $profileSetupRoute === ProfileSetupRoute.Setup}
    <Transition>
        <SetupView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.SetupNew}
    <Transition>
        <SetupNewView />
    </Transition>
{:else if $profileSetupRoute === ProfileSetupRoute.EnterName}
    <Transition>
        <EnterNameView />
    </Transition>
{/if}
