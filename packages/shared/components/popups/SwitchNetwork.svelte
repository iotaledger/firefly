<script lang="typescript">
    import { Button, Icon, Spinner, Text } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Network } from 'shared/lib/typings/network'
    import { closePopup } from 'shared/lib/popup'

    export let locale: Locale

    export let newNetwork: Network

    let isSwitchingNetwork = false

    const handleCancelNetworkSwitchClick = (): void => {
        closePopup()
    }

    const handleConfirmNetworkSwitchClick = (): void => {
        console.log('TODO: Handle switching networks')

        isSwitchingNetwork = true

        setTimeout(closePopup, 1200)
    }
</script>

<Text type="h4" classes="mb-9">{locale('popups.switchNetwork.title')}</Text>
<div class="w-full h-full mb-3">
    <div class="flex flex-row justify-between">
        <div class="relative flex flex-col items-center bg-gray-50 dark:bg-gray-800 rounded-2xl mb-6 p-3">
            <div class="bg-red-500 rounded-2xl absolute -top-6 w-12 h-12 flex items-center justify-center">
                <Icon icon="warning" classes="text-white" />
            </div>
            <Text type="p" secondary classes="self-start ml-4 mt-6 mb-3">
                {locale('popups.switchNetwork.newNetwork')}
                : <Text highlighted classes="inline">{newNetwork.name}</Text>
            </Text>
            <Text type="p" classes="dark:text-white ml-4 mb-4">
                {locale('popups.switchNetwork.resetWarning')}
            </Text>
        </div>
    </div>
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8">
    <Button secondary classes="w-1/2" onClick={handleCancelNetworkSwitchClick}>
        {locale('actions.cancel')}
    </Button>
    <Button warning classes="w-1/2" onClick={handleConfirmNetworkSwitchClick}>
    {#if isSwitchingNetwork}
        <Spinner busy message={locale('popups.switchNetwork.switchingNetwork')} classes="justify-center" />
    {:else}
        {locale('actions.confirm')}
    {/if}
    </Button>
</div>
