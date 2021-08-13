<script lang="ts">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import { Animation,Text } from 'shared/components';
    import { composeBip32Path } from 'shared/lib/bip32'
    import { formatAddressForLedger } from 'shared/lib/ledger';
    import { showAppNotification } from 'shared/lib/notifications';
    import { closePopup,popupState } from 'shared/lib/popup';
    import { activeProfile } from 'shared/lib/profile'

    export let locale

    export let address = ''

    let bip32Path
    $: {
        if ($activeProfile.settings.displayBip32Path) {
            bip32Path = composeBip32Path(true) ?? ''
        }
    }

    const onInvalid = () => {
        showAppNotification({
            type: 'error',
            message: locale('error.ledger.generateAddress'),
        })

        if (get(popupState).active) closePopup(true)
    }

    onMount(() => {
        if (!address) onInvalid()
    })
</script>

<Text type="h4" classes="mb-6">{locale('popups.ledgerAddress.title')}</Text>
<Text type="p" classes="mb-6" secondary>{locale('popups.ledgerAddress.body')}</Text>

<div class="relative w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    <Animation animation="ledger-confirm-address-desktop" />
</div>
<div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
    <Text type="h5" highlighted classes="mb-2">{locale('general.receiveAddress')}</Text>
    <Text type="pre" classes={$activeProfile.settings.displayBip32Path && bip32Path ? 'mb-4' : ''}>
        {formatAddressForLedger(address)}
    </Text>

    {#if $activeProfile.settings.displayBip32Path && bip32Path}
        <Text type="h5" highlighted classes="mb-2">{locale('general.bip32Path')}</Text>
        <Text type="pre">{bip32Path}</Text>
    {/if}
</div>
