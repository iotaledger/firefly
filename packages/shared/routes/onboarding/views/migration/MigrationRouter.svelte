<script lang="typescript">
    import { Transition } from 'shared/components'
    import {
        BundleMiningWarningView,
        MigrateView,
        SecureSpentAddressesView,
        SecuringSpentAddressesView,
        SecurityCheckCompletedView,
        TransferFragmentedFundsView,
    } from './views'
    import { FireflyEvent, migrationRoute, migrationRouter, MigrationRoute } from '@core/router'

    const next = (event: CustomEvent<FireflyEvent>): void => $migrationRouter.next(event.detail)
    const previous = (): void => $migrationRouter.previous()
</script>

{#if $migrationRoute === MigrationRoute.Init}
    <Transition>
        <MigrateView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrationRoute === MigrationRoute.TransferFragmentedFunds}
    <Transition>
        <TransferFragmentedFundsView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrationRoute === MigrationRoute.BundleMiningWarning}
    <Transition>
        <BundleMiningWarningView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrationRoute === MigrationRoute.SecureSpentAddresses}
    <Transition>
        <SecureSpentAddressesView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrationRoute === MigrationRoute.SecuringSpentAddresses}
    <Transition>
        <SecuringSpentAddressesView on:next={next} on:previous={previous} />
    </Transition>
{:else if $migrationRoute === MigrationRoute.SecurityCheckCompleted}
    <Transition>
        <SecurityCheckCompletedView on:next={next} on:previous={previous} />
    </Transition>
{/if}
