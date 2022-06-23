<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        BundleMiningWarningView,
        MigrateView,
        SecureSpentAddressesView,
        SecuringSpentAddressesView,
        SecurityCheckCompletedView,
        TransferFragmentedFundsView,
    } from './views/'
    import { FireflyEvent, migrateRoute, MigrateRouter, MigrateRoute } from '@core/router'

    const migrateRouter = new MigrateRouter()

    function next(event: CustomEvent<FireflyEvent>): void {
        migrateRouter.next(event.detail)
    }

    function previous(): void {
        migrateRouter.previous()
    }
</script>

{#if $migrateRoute === MigrateRoute.Init}
    <Transition>
        <MigrateView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrateRoute === MigrateRoute.TransferFragmentedFunds}
    <Transition>
        <TransferFragmentedFundsView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrateRoute === MigrateRoute.BundleMiningWarning}
    <Transition>
        <BundleMiningWarningView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrateRoute === MigrateRoute.SecureSpentAddresses}
    <Transition>
        <SecureSpentAddressesView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrateRoute === MigrateRoute.SecuringSpentAddresses}
    <Transition>
        <SecuringSpentAddressesView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrateRoute === MigrateRoute.SecurityCheckCompleted}
    <Transition>
        <SecurityCheckCompletedView on:next={next} on:previous={previous} />
    </Transition>
{/if}
