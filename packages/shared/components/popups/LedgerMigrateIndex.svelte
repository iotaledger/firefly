<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { closePopup } from 'shared/lib/popup'
    import { setRoute, walletSetupType } from 'shared/lib/router'
    import { AppRoute, SetupType } from 'shared/lib/typings/routes'

    export let locale

    function handleYesClick() {
        closePopup()
        walletSetupType.set(SetupType.TrinityLedger)
        setRoute(AppRoute.LedgerSetup)
    }

    function handleNoClick() {
        closePopup()
    }
</script>

<div class="mb-6">
    <Text type="h4" classes="mb-4">{locale('popups.ledgerMigrateIndex.title')}</Text>
    <Text type="p" secondary>{locale('popups.ledgerMigrateIndex.body')}</Text>
</div>
<div class="flex flex-row justify-between w-full space-x-4 px-8">
    <Button secondary classes="w-1/2" onClick={handleNoClick}>{locale('actions.no')}</Button>
    <Button secondary classes="w-1/2" onClick={handleYesClick}>{locale('actions.yes')}</Button>
</div>
