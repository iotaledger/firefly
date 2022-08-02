<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        // routers
        AppSetupRouter,
        LedgerSetupRouter,
        MigrationRouter,
        NetworkSetupRouter,
        PasswordSetupRouter,
        ProfileBackupRouter,
        ProfileRecoveryRouter,
        ProfileSetupRouter,
        ProtectionRouter,
        ShimmerClaimingRouter,

        // views
        CongratulationsView,
        WelcomeView,
    } from './views'
    import { OnboardingRoute, onboardingRoute } from '@core/router'

    import { onboardingProfile } from '../../lib/contexts/onboarding'
    /* eslint-disable no-console */
    $: console.log('ONBOARDING PROFILE: ', $onboardingProfile)
</script>

{#if $onboardingRoute === OnboardingRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.AppSetup}
    <Transition>
        <AppSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.NetworkSetup}
    <Transition>
        <NetworkSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileSetup}
    <Transition>
        <ProfileSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.LedgerSetup}
    <Transition>
        <LedgerSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.PasswordSetup}
    <Transition>
        <PasswordSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Protection}
    <Transition transition={false}>
        <ProtectionRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileBackup}
    <Transition transition={false}>
        <ProfileBackupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileRecovery}
    <Transition transition={false}>
        <ProfileRecoveryRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ShimmerClaiming}
    <Transition>
        <ShimmerClaimingRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Migration}
    <Transition>
        <MigrationRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Congratulations}
    <Transition>
        <CongratulationsView />
    </Transition>
{/if}
