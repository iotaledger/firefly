<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { Animation, Button, OnboardingLayout, SpentAddress, Text } from 'shared/components'
    import { mobile } from 'shared/lib/app'
    import { spentAddressesFromBundles, toggleMiningSelection } from 'shared/lib/migration'
    import { closePopup, openPopup } from 'shared/lib/popup'
    import { walletSetupType } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/setup'
    import { RiskLevel } from 'shared/lib/typings/migration'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    const addresses = $spentAddressesFromBundles
        .map((address) =>
            Object.assign({}, address, {
                id: address.index,
                risk: address.crackability,
            })
        )
        .sort((a, b) => b.risk - a.risk)

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

    function handleContinueClick() {
        if (addresses.find((address) => address?.risk > RiskLevel.MEDIUM)) {
            triggerPopup()
        } else {
            dispatch('next', { skippedMining: true })
        }
    }
    function rerunProcess() {
        dispatch('previous')
    }
    function triggerPopup(skippedMining = false) {
        openPopup({
            type: 'riskFunds',
            props: {
                onProceed: () => {
                    closePopup()
                    dispatch('next', { skippedMining })
                },
                subtitle: locale('popups.riskFunds.body2'),
            },
        })
    }
</script>

<OnboardingLayout
    allowBack={false}
    {locale}
    classes="relative"
    showLedgerProgress={legacyLedger}
    showLedgerVideoButton={legacyLedger}
>
    <div slot="title">
        <Text type="h2">{locale('views.securityCheckCompleted.title')}</Text>
    </div>
    <div slot="leftpane__content" class="h-full flex flex-col flex-wrap">
        <Text type="p" secondary classes="mb-4">{locale('views.securityCheckCompleted.body1')}</Text>
        <Text type="p" secondary classes="mb-6">{locale('views.securityCheckCompleted.body2')}</Text>
        <div class="flex-auto overflow-y-auto h-1 space-y-4 w-full scrollable-y scroll-secondary">
            {#each addresses as address}
                <SpentAddress
                    {...address}
                    {locale}
                    selected={selectedAddresses.find((_address) => _address.id === address.id)}
                    showRiskLevel
                    onClick={() => onAddressClick(address)}
                />
            {/each}
        </div>
    </div>
    <div slot="leftpane__action" class="flex flex-col items-center">
        <Button secondary disabled={!selectedAddresses.length} classes="w-full mt-2" onClick={() => rerunProcess()}>
            {locale('views.securityCheckCompleted.rerun')}
        </Button>
        <Button classes="w-full mt-4" onClick={() => handleContinueClick()}>
            {locale('views.securityCheckCompleted.continueMigration')}
        </Button>
    </div>
    <div
        slot="rightpane"
        class="w-full h-full flex justify-center {$mobile ? 'overflow-hidden ' : 'bg-pastel-blue dark:bg-gray-900'}"
    >
        <Animation classes="setup-anim-aspect-ratio" {animation} />
    </div>
</OnboardingLayout>
