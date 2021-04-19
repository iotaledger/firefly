<script lang="typescript">
    import { Button, Illustration, Link, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import {
        checkChrysalisSnapshot,
        ongoingSnapshot,
        selectAllAddressesForMining,
        spentAddressesFromBundles,
        toggleMiningSelection,
    } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { createEventDispatcher } from 'svelte'
    import { get } from 'svelte/store'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let addresses = $spentAddressesFromBundles.map((address) => Object.assign({}, address, { id: address.index }))

    let selectedAddresses = addresses.filter((address) => address.selectedToMine === true)

    let snapshotBusy = false

    function onAddressClick(address) {
        var index = selectedAddresses.findIndex((_address) => _address.id === address.id)
        if (index === -1) {
            selectedAddresses.push(address)
        } else {
            selectedAddresses.splice(index, 1)
        }

        toggleMiningSelection(address)
        selectedAddresses = selectedAddresses
    }

    function handleBackClick() {
        // If a user goes back, automatically select all bundles with spent addresses
        selectAllAddressesForMining()

        dispatch('previous')
    }

    async function secureAddresses() {
        // Migration: snapshot check
        snapshotBusy = true
        await checkChrysalisSnapshot()
        //
        if (get(ongoingSnapshot) === false) {
            if (selectedAddresses.length) {
                if (selectedAddresses?.length < addresses?.length) {
                    triggerPopup()
                } else {
                    dispatch('next')
                }
            } else {
                showAppNotification({ type: 'error', message: locale('views.migrate.noAddressesForMigration') })
            }
        }
        snapshotBusy = false
    }

    async function handleSkipClick() {
        // Migration: snapshot check
        snapshotBusy = true
        await checkChrysalisSnapshot()
        //
        if (get(ongoingSnapshot) === false) {
            triggerPopup(true)
        }
        snapshotBusy = false
    }

    function triggerPopup(skippedMining = false) {
        openPopup({
            type: 'riskFunds',
            props: {
                onProceed: () => {
                    closePopup()
                    dispatch('next', { skippedMining })
                },
            },
        })
    }
</script>

{#if mobile}
    <div>foo</div>
{:else}
    <OnboardingLayout onBackClick={handleBackClick}>
        <div slot="leftpane__content" class="relative h-full flex flex-col flex-wrap">
            <Text type="h2" classes="mb-5">{locale('views.secureSpentAddresses.title')}</Text>
            <Text type="p mb-4" secondary>
                {locale('views.secureSpentAddresses.body1', { values: { number: addresses.length } })}
            </Text>
            <Text type="p" secondary classes="mb-4">{locale('views.secureSpentAddresses.body2')}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.migrate.noAddressesForMigration')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
                {#each addresses as address}
                    <SpentAddress
                        {...address}
                        {locale}
                        selected={selectedAddresses.find((_address) => _address.id === address.id)}
                        onClick={() => onAddressClick(address)} />
                {/each}
            </div>
            <Link disabled={snapshotBusy} onClick={handleSkipClick} classes="absolute -top-12 right-0">
                {locale('actions.skip')}
            </Link>
        </div>
        <div slot="leftpane__action">
            <Button disabled={snapshotBusy} classes="w-full" onClick={() => secureAddresses()}>
                {locale('views.secureSpentAddresses.title')}
            </Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
