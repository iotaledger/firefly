<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, Link, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { selectAllAddressesForMining, spentAddressesFromBundles, toggleMiningSelection } from 'shared/lib/migration'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { Locale } from '@core/i18n'
    import { walletSetupType } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/setup'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    const addresses = $spentAddressesFromBundles.map((address) => Object.assign({}, address, { id: address.index }))

    let selectedAddresses = addresses.filter((address) => address.selectedToMine === true)

    const legacyLedger = $walletSetupType === SetupType.TrinityLedger
    $: animation = legacyLedger ? 'ledger-migrate-desktop' : 'migrate-desktop'

    function onAddressClick(address) {
        const index = selectedAddresses.findIndex((_address) => _address.id === address.id)
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

    function secureAddresses() {
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

    function handleSkipClick() {
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

<OnboardingLayout
    onBackClick={handleBackClick}
    {locale}
    showLedgerProgress={legacyLedger}
    showLedgerVideoButton={legacyLedger}
>
    <div slot="title">
        <Text type="h2">{locale('views.secureSpentAddresses.title')}</Text>
    </div>
    <div slot="leftpane__content" class="relative h-full flex flex-col flex-wrap">
        <Text classes="mb-4" type="p" secondary>
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
                    onClick={() => onAddressClick(address)}
                />
            {/each}
        </div>
        <Link onClick={handleSkipClick} classes="absolute -top-12 right-0">{locale('actions.skip')}</Link>
    </div>
    <div slot="leftpane__action">
        <Button classes="w-full" onClick={() => secureAddresses()}>{locale('views.secureSpentAddresses.title')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center {!$mobile && 'bg-pastel-blue dark:bg-gray-900'}">
        <Animation classes="setup-anim-aspect-ratio" {animation} />
    </div>
</OnboardingLayout>
