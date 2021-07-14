<script lang="ts">
    import { Illustration, Text } from 'shared/components'
    import { formatUnitBestMatch } from 'shared/lib/units'

    type Output = {
        address: string
        value: number
        checksum: string
    }
    type Input = {
        address: string
        balance: number
        index: number
        checksum: string
    }

    export let locale
    export let output: Output
    export let inputs: Input[]

    const formatAmount = (amountRaw: number): string => {
        return formatUnitBestMatch(amountRaw)
    }
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

<div class="transaction flex flex-col space-y-4 scrollable-y pb-4">
    <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col space-y-1">
        <Text type="h5" highlighted classes="mb-1">{locale('popups.ledgerTransaction.transaction.output')}</Text>
        <Text type="pre">{formatAmount(output.value)}</Text>
        <Text type="pre">{output.address}</Text>
        <Text type="pre">
            {locale('popups.ledgerTransaction.transaction.checksum', { values: { checksum: output.checksum } })}
        </Text>
    </div>
    {#each inputs as { address, balance, checksum, index }}
        <div class="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col space-y-1">
            <Text type="h5" highlighted classes="mb-1">
                {locale('popups.ledgerTransaction.transaction.input', { values: { index } })}
            </Text>
            <Text type="pre">{formatAmount(balance)}</Text>
            <Text type="pre">{address}</Text>
            <Text type="pre">{locale('popups.ledgerTransaction.transaction.checksum', { values: { checksum } })}</Text>
        </div>
    {/each}
</div>
