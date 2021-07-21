<script lang="ts">
    import { Illustration, Text } from 'shared/components'
    import { showAppNotification } from 'shared/lib/notifications'
    import { get } from 'svelte/store'
    import { closePopup, popupState } from 'shared/lib/popup'
    import { onMount } from 'svelte'

    export let locale

    export let address = ''

    const onInvalid = () => {
        showAppNotification({
            type: 'error',
            message: locale('error.ledger.generateAddress')
        })

        if (get(popupState).active) closePopup()
    }

    onMount(() => {
        if(!address)
            onInvalid()
    })
</script>

<Text type="h4" classes="mb-6">{locale('popups.ledgerAddress.title')}</Text>
<Text type="p" classes="mb-6" secondary>{locale('popups.ledgerAddress.body')}</Text>

<div class="illustration w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Illustration illustration="ledger-confirm-address-desktop" />
</div>
<div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
    <Text type="h5" highlighted classes="mb-2">
        {locale('general.receiveAddress')}
    </Text>
    <Text type="pre">{address}</Text>
</div>
