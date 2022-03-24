<script lang="typescript">
    import { onMount } from 'svelte'
    import { Transition } from 'shared/components'
    import { currentLedgerMigrationProgress } from 'shared/lib/migration'
    import { FireflyEvent, ledgerRoute, ledgerRouter, LedgerRoute } from '@core/router'
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
            case LedgerRoute.Connect:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.InstallLedgerApp)
                break
            case LedgerRoute.GenerateAddress:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.GenerateAddress)
                break
            case LedgerRoute.SwitchApps:
                currentLedgerMigrationProgress.set(LedgerMigrationProgress.SwitchLedgerApp)
                break
            case LedgerRoute.AccountIndex:
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

{#if $ledgerRoute === LedgerRoute.Connect}
    <Transition>
        <Connect on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.RestoreFromLedger}
    <Transition>
        <RestoreFromLedger on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.LegacyIntro}
    <Transition>
        <LegacyIntro on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.InstallationGuide}
    <Transition>
        <InstallationGuide on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.GenerateAddress}
    <Transition>
        <GenerateNewAddress on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.SwitchApps}
    <Transition>
        <SwitchApps on:next={next} on:previous={previous} {locale} />
    </Transition>
{:else if $ledgerRoute === LedgerRoute.AccountIndex}
    <Transition>
        <AccountIndex on:next={next} on:previous={previous} {locale} />
    </Transition>
{/if}
