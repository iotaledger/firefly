<script lang="typescript" xmlns="http://www.w3.org/1999/html">
    import { Animation, Text } from 'shared/components'
    import { Input, Transfer } from 'shared/lib/typings/migration'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import { Locale } from '@core/i18n'

    export let locale: Locale

    export let transfer: Transfer
    export let inputs: Input[]

    // Hardcoded strings because Ledger does not translate them
    // const checksumString = (checksum): string => `Chk: ${checksum}`
    const inputString = (index): string => `Input [${index}]`
    const outputString = 'Output'
</script>

<Text type="h4" classes="mb-6">{locale('popups.ledgerTransaction.transaction.title')}</Text>
<Text type="p" classes="mb-6" secondary>{locale('popups.ledgerTransaction.transaction.info')}</Text>

<div class="relative w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Animation
        width="100%"
        animation="ledger-bg-desktop"
        classes="absolute transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    />
    <Animation animation="ledger-confirm-address-desktop" />
</div>

<div class="transaction flex flex-col space-y-4 scrollable-y">
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
        <Text type="h5" highlighted classes="mb-2">{outputString}</Text>
        <Text type="pre">{formatUnitBestMatch(transfer.value)}</Text>
        <Text type="pre">{transfer.address}</Text>
        <Text type="pre">
            <!-- {#await asyncGetAddressChecksum(transfer.address)}...{:then checksum}{checksumString(checksum)}{/await} -->
        </Text>
    </div>
    {#each inputs as { address, balance, index }}
        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 text-center">
            <Text type="h5" highlighted classes="mb-2">{inputString(index)}</Text>
            <Text type="pre">{formatUnitBestMatch(balance)}</Text>
            <Text type="pre">{address}</Text>
            <Text type="pre">
                <!-- {#await asyncGetAddressChecksum(address, true)}...{:then checksum}{checksumString(checksum)}{/await} -->
            </Text>
        </div>
    {/each}
</div>

<style>
    .transaction {
        max-height: 30vh;
    }
</style>
