<script lang="typescript">
    import { Animation, Button, Icon, Illustration, Link, OnboardingLayout, Text } from 'shared/components'
    import { openPopup } from 'shared/lib/popup'
    import { LedgerAppName } from 'shared/lib/typings/ledger'
    import { createEventDispatcher } from 'svelte'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    const dispatch = createEventDispatcher()

    function handleContinueClick() {
        dispatch('next')
    }

    function handleBackClick() {
        dispatch('previous')
    }

    function handlePopupOpen() {
        openPopup({
            type: 'ledgerAppGuide',
        })
    }
</script>

<OnboardingLayout onBackClick={handleBackClick} {locale} showLedgerVideoButton>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{locale('views.ledgerInstallationGuide.title')}</Text>
        <Text type="p" secondary classes="mb-5">
            {locale('views.ledgerInstallationGuide.body1', { values: { legacy: LedgerAppName.IOTALegacy } })}
        </Text>
        <Text type="p" secondary classes="mb-5">{locale('views.ledgerInstallationGuide.body2')}</Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-28">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="ledger-app-legacy" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.IOTALegacy}</Text>
            </div>
            <Icon icon="plus" height="15" width="15" classes="-mt-6 text-blue-400" />
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="ledger-app" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.IOTA}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Link icon="info" onClick={handlePopupOpen} classes="mb-10 justify-center"
            >{locale('popups.ledgerAppGuide.title')}</Link
        >
        <Button classes="w-full" onClick={handleContinueClick}>{locale('views.ledgerInstallationGuide.action')}</Button>
    </div>
    <div slot="rightpane" class="w-full h-full flex justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Animation
            width="100%"
            animation="ledger-bg-desktop"
            classes="absolute z-0 transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <Illustration width="100%" illustration="ledger-install-new-app-desktop" classes="z-0" />
    </div>
</OnboardingLayout>
