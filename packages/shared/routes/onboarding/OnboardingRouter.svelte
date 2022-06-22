<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        // router
        BackupRouter,
        ImportRouter,
        LedgerRouter,
        MigrationRouter,
        NetworkRouter,
        ProtectionRouter,

        // views
        BalanceView,
        ClaimRewardsView,
        CongratulationsView,
        CrashReportingView,
        CreateView,
        LanguageAndAppearanceView,
        LegalView,
        PasswordView,
        ProfileView,
        SecureView,
        SetupView,
        WelcomeView,
    } from './views'
    import { _ } from '@core/i18n'
    import { OnboardingRoute, onboardingRoute } from '@core/router'
</script>

{#if $onboardingRoute === OnboardingRoute.Welcome}
    <Transition>
        <WelcomeView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Legal}
    <Transition>
        <LegalView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.CrashReporting}
    <Transition>
        <CrashReportingView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.LanguageAndAppearance}
    <Transition>
        <LanguageAndAppearanceView locale={$_} />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Profile}
    <Transition>
        <ProfileView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Setup}
    <Transition>
        <SetupView />
    </Transition>
    <!-- TODO: fix ledger -->
{:else if $onboardingRoute === OnboardingRoute.Create}
    <Transition>
        <CreateView />
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
{:else if $onboardingRoute === OnboardingRoute.Protect}
    <Transition transition={false}>
        <ProtectionRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Backup}
    <Transition transition={false}>
        <BackupRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Import}
    <Transition transition={false}>
        <ImportRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Balance}
    <Transition>
        <BalanceView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.ClaimRewards}
    <Transition>
        <ClaimRewardsView />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Migrate}
    <Transition>
        <MigrationRouter />
    </Transition>
{:else if $onboardingRoute === OnboardingRoute.Congratulations}
    <Transition>
        <CongratulationsView />
    </Transition>
{/if}
