<script lang="typescript">
    import { Button, Illustration, Link, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import {
        MINIMUM_MIGRATION_BALANCE,
        selectedUnmigratedBundles,
        spentAddressesFromBundles,
        toggleInputSelection,
        unselectAllUnspent,
    } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { createEventDispatcher } from 'svelte'

    export let locale
    export let mobile

    const dispatch = createEventDispatcher()

    let addresses = $spentAddressesFromBundles
        .map((address) =>
            Object.assign({}, address, { disabled: address.balance < MINIMUM_MIGRATION_BALANCE, id: address.index })
        )
        .sort((a, b) => b.balance - a.balance)

    let selectedAddresses = addresses.filter((address) => address.disabled === false && address.selected === true)

    function onAddressClick(address) {
        var index = selectedAddresses.findIndex((_address) => _address.id === address.id)
        if (index === -1) {
            selectedAddresses.push(address)
        } else {
            selectedAddresses.splice(index, 1)
        }

        toggleInputSelection(address)
        selectedAddresses = selectedAddresses
    }

    function handleBackClick() {
        dispatch('previous')
    }
    function secureAddresses() {
        if (selectedAddresses.length) {
            if (selectedAddresses?.length < addresses?.filter((_address) => !_address.disabled)?.length) {
                triggerPopup()
            } else {
                dispatch('next')
            }
        } else {
            if (selectedUnmigratedBundles.length) {
                triggerPopup(true)
            } else {
                showAppNotification({ type: 'error', message: locale('views.migrate.noAddressesForMigration') })
            }
        }
    }

    function handleSkipClick() {
        unselectAllUnspent()
        triggerPopup(true)
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
            <Text type="p" secondary>{locale('views.secureSpentAddresses.body1', { values: { number: addresses.length } })}</Text>
            <Text type="p" secondary classes="mb-6">{locale('views.secureSpentAddresses.body2')}</Text>
            <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
                {#each addresses as address}
                    <SpentAddress
                        {...address}
                        {locale}
                        selected={selectedAddresses.find((_address) => _address.id === address.id)}
                        onClick={() => onAddressClick(address)} />
                {/each}
            </div>
            <Link onClick={handleSkipClick} classes="absolute -top-12 right-0">{locale('actions.skip')}</Link>
        </div>
        <div slot="leftpane__action">
            <Button classes="w-full" onClick={() => secureAddresses()}>{locale('views.secureSpentAddresses.title')}</Button>
        </div>
        <div slot="rightpane" class="w-full h-full flex justify-center bg-pastel-blue dark:bg-gray-900">
            <Illustration illustration="migrate-desktop" height="100%" width="auto" />
        </div>
    </OnboardingLayout>
{/if}
