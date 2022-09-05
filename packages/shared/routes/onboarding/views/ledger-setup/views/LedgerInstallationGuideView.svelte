<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { LedgerAnimation, Button, Icon, Link, OnboardingLayout, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from '@lib/popup'
    import { LedgerAppName } from '@core/ledger'

    const dispatch = createEventDispatcher()

    function handleContinueClick(): void {
        dispatch('next')
    }

    function handleBackClick(): void {
        dispatch('previous')
    }

    function handlePopupOpen(): void {
        openPopup({
            type: 'ledgerAppGuide',
        })
    }
</script>

<OnboardingLayout onBackClick={handleBackClick}>
    <div slot="leftpane__content">
        <Text type="h2" classes="mb-5">{localize('views.ledgerInstallationGuide.title')}</Text>
        <Text type="p" secondary classes="mb-5">
            {localize('views.ledgerInstallationGuide.body1', { values: { protocol: LedgerAppName.Shimmer } })}
        </Text>
        <Text type="p" secondary classes="mb-5">{localize('views.ledgerInstallationGuide.body2')}</Text>
        <div class="flex flex-row flex-nowrap items-center justify-center space-x-4 text-center mt-28">
            <div class="flex flex-col flex-wrap space-y-2">
                <div class="bg-blue-400 rounded-2xl w-20 h-20 flex justify-center items-center">
                    <Icon icon="shimmer" width="32" height="32" classes="text-white" />
                </div>
                <Text type="p" secondary>{LedgerAppName.Shimmer}</Text>
            </div>
        </div>
    </div>
    <div slot="leftpane__action">
        <Link icon="info" onClick={handlePopupOpen} classes="mb-10 justify-center"
            >{localize('popups.ledgerAppGuide.title')}</Link
        >
        <Button classes="w-full" onClick={handleContinueClick}
            >{localize('views.ledgerInstallationGuide.action')}</Button
        >
    </div>
    aaa
    <LedgerAnimation slot="rightpane" illustration="ledger-install-new-app-desktop" />
</OnboardingLayout>
