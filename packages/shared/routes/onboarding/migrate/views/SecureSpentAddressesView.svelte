<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, Link, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { mobile } from '@core/app'
    import { localize } from '@core/i18n'
    import { selectAllAddressesForMining, spentAddressesFromBundles, toggleMiningSelection } from '@lib/migration'
    import { showAppNotification } from '@lib/notifications'
    import { closePopup, openPopup } from '@lib/popup'
    import { walletSetupType } from '@lib/wallet'
    import { SetupType } from '@lib/typings/setup'

    const dispatch = createEventDispatcher()
    const addresses = $spentAddressesFromBundles.map((address) => Object.assign({}, address, { id: address.index }))
    const legacyLedger = $walletSetupType === SetupType.TrinityLedger

    let selectedAddresses = addresses.filter((address) => address.selectedToMine === true)

    $: animation = legacyLedger ? 'ledger-migrate-desktop' : 'migrate-desktop'

    function onAddressClick(address): void {
        const index = selectedAddresses.findIndex((_address) => _address.id === address.id)
        if (index === -1) {
            selectedAddresses.push(address)
        } else {
            selectedAddresses.splice(index, 1)
        }

        toggleMiningSelection(address)
        selectedAddresses = selectedAddresses
    }

    function handleBackClick(): void {
        // If a user goes back, automatically select all bundles with spent addresses
        selectAllAddressesForMining()

        dispatch('previous')
    }

    function secureAddresses(): void {
        if (selectedAddresses.length) {
            if (selectedAddresses?.length < addresses?.length) {
                triggerPopup()
            } else {
                dispatch('next')
            }
        } else {
            showAppNotification({ type: 'error', message: localize('views.migrate.noAddressesForMigration') })
        }
    }

    function handleSkipClick(): void {
        triggerPopup(true)
    }

    function triggerPopup(skippedMining = false): void {
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

<OnboardingLayout onBackClick={handleBackClick} showLedgerProgress={legacyLedger} showLedgerVideoButton={legacyLedger}>
    <div slot="title">
        <Text type="h2">{localize('views.secureSpentAddresses.title')}</Text>
    </div>
    <div slot="leftpane__content" class="relative h-full flex flex-col flex-wrap">
        <Text type="p mb-4" secondary>
            {localize('views.secureSpentAddresses.body1', { values: { number: addresses.length } })}
        </Text>
        <Text type="p" secondary classes="mb-4">{localize('views.secureSpentAddresses.body2')}</Text>
        <Text type="p" secondary classes="mb-6">{localize('views.migrate.noAddressesForMigration')}</Text>
        <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
            {#each addresses as address}
                <SpentAddress
                    {...address}
                    selected={selectedAddresses.find((_address) => _address.id === address.id)}
                    onClick={() => onAddressClick(address)}
                />
            {/each}
        </div>
        <Link onClick={handleSkipClick} classes="absolute -top-12 right-0">{localize('actions.skip')}</Link>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={secureAddresses}>{localize('views.secureSpentAddresses.title')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" {animation} />
    </div>
</OnboardingLayout>
