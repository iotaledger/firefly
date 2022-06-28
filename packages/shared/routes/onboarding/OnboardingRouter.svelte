<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        // routers
        AppSetupRouter,
        BackupRouter,
        LedgerRouter,
        MigrationRouter,
        NetworkRouter,
        ProfileSetupRouter,
        ProtectionRouter,
        RecoveryRouter,

        // views
        BalanceView,
        ClaimRewardsView,
        CongratulationsView,
        PasswordView,
        SecureView,
        WelcomeView,
    } from './views'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.AppSetup}
    <Transition>
        <AppSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ProfileSetup}
    <Transition>
        <ProfileSetupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Network}
    <Transition>
        <NetworkRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.LedgerSetup}
    <Transition>
        <LedgerRouter />
    </Transition>
    <!--  -->
{:else if $onboardingRoute === OnboardingRoute.Secure}
    <Transition>
        <SecureView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Password}
    <Transition>
        <PasswordView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Protection}
    <Transition transition={false}>
        <ProtectionRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Backup}
    <Transition transition={false}>
        <BackupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Recovery}
    <Transition transition={false}>
        <RecoveryRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Balance}
    <Transition>
        <BalanceView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ClaimRewards}
    <Transition>
        <ClaimRewardsView />
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
