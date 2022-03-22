<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress } from 'shared/lib/migration'
    import { FireflyEvent, ledgerRoute, ledgerRouter, LedgerRoutes } from '@core/router'
    import {
        AccountIndex,
        Connect,
        GenerateNewAddress,
        InstallationGuide,
        LegacyIntro,
        RestoreFromLedger,
        SwitchApps,
    } from './views/'
    import { Locale } from 'shared/lib/typings/i18n'
    import { LedgerMigrationProgress } from 'shared/lib/typings/migration'

    export let locale: Locale

    $: $ledgerRoute, updateMigrationProgress()

    onMount(() => {
        $ledgerRouter.restartIfNotInLedgerFlow()
    })

    const updateMigrationProgress = (): void => {
        switch ($ledgerRoute) {
            case LedgerRoutes.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case LedgerRoutes.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case LedgerRoutes.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case LedgerRoutes.AccountIndex:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.TransferFunds)
                break
            default:
                currentLedgerMigrationProgress.set(null)
                break
        }
    }

    const next = (event: CustomEvent<FireflyEvent>): void => $ledgerRouter.next(event.detail)
    const previous = (): void => $ledgerRouter.previous()
</script>

{#if $ledgerRoute === LedgerRoutes.Connect}
    <Transition>
        <Connect on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.RestoreFromLedger}
    <Transition>
        <RestoreFromLedger on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.LegacyIntro}
    <Transition>
        <LegacyIntro on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.InstallationGuide}
    <Transition>
        <InstallationGuide on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.GenerateAddress}
    <Transition>
        <GenerateNewAddress on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.SwitchApps}
    <Transition>
        <SwitchApps on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoutes.AccountIndex}
    <Transition>
        <AccountIndex on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}
