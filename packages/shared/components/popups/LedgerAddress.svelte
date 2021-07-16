<script lang="ts">
    import { Illustration, Text } from 'shared/components'
    import { ledgerReceiveAddress } from 'shared/lib/wallet'

    export let locale
</script>

<Text type="h4" classes="mb-6">{locale('popups.ledgerAddress.title')}</Text>
<Text type="p" classes="mb-6" secondary>{locale('popups.ledgerAddress.body')}</Text>

<div class="illustration w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Illustration illustration="ledger-confirm-address-desktop" />
</div>
<div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
    <Text type="h5" highlighted classes="mb-2">
        {locale('general.newAddress')}
    </Text>
    <Text type="pre">{$ledgerReceiveAddress}</Text>
</div>
