<script lang="ts">
    import { Illustration, Text } from 'shared/components'
    import { formatAddressForLedger } from 'shared/lib/ledger'
    import { asyncGetAddressChecksum } from 'shared/lib/migration'
    import { formatUnitBestMatch } from 'shared/lib/units'
    import type { Input, Transfer } from 'shared/lib/typings/migration'

    export let locale
    export let transfer: Transfer
    export let inputs: Input[]
</script>

<style>
    .transaction {
        max-height: 30vh;
    }
</style>

<Text type="h4" classes="mb-6">{locale('popups.ledgerTransaction.transaction.title')}</Text>
<Text type="p" classes="mb-6" secondary>{locale('popups.ledgerTransaction.transaction.info')}</Text>

<div class="illustration w-full h-1/2 bg-white dark:bg-gray-900 flex justify-center content-center">
    <Illustration illustration="ledger-confirm-address-desktop" />
</div>

<div class="transaction flex flex-col space-y-4 scrollable-y">
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 mb-4 flex flex-col space-y-1 text-center">
        <Text type="h5" highlighted classes="mb-2">{locale('popups.ledgerTransaction.transaction.output')}</Text>
        <Text type="pre">{formatUnitBestMatch(transfer.value)}</Text>
        <Text type="pre">{formatAddressForLedger(transfer.address)}</Text>
        <Text type="pre">
            {#await asyncGetAddressChecksum(transfer.address)}
                ...
            {:then checksum}
                {locale('popups.ledgerTransaction.transaction.checksum', { values: { checksum } })}
            {/await}
        </Text>
    </div>
    {#each inputs as { address, balance, index }}
        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-5 mb-4 flex flex-col space-y-1 text-center">
            <Text type="h5" highlighted classes="mb-2">
                {locale('popups.ledgerTransaction.transaction.input', { values: { index } })}
            </Text>
            <Text type="pre">{formatUnitBestMatch(balance)}</Text>
            <Text type="pre">{formatAddressForLedger(address)}</Text>
            <Text type="pre">
                {#await asyncGetAddressChecksum(address, true)}
                    ...
                {:then checksum}
                    {locale('popups.ledgerTransaction.transaction.checksum', { values: { checksum } })}
                {/await}
            </Text>
        </div>
    {/each}
</div>
