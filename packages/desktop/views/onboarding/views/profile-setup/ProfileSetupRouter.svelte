<script lang="ts">
    import { Platform } from '@core/app'
    import { ProfileSetupRoute, profileSetupRoute } from '@core/router'
    import features from '@features/features'
    import { Transition } from 'shared/components'
    import { EnterNameView, SetupClaimedView, SetupNewView, SetupRecoveredView, SetupView } from './views'

    $: if (features.analytics.onboardingRoute.profileSetupRoute.enabled && $profileSetupRoute) {
        Platform.trackEvent('profile-setup-route', { route: $profileSetupRoute })
    }
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
