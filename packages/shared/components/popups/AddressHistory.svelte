<script lang="typescript">
    import { Text } from 'shared/components'
    import type { Address } from 'shared/lib/typings/address'
    import { formatUnit } from 'shared/lib/units'
    import type { WalletAccount } from 'shared/lib/wallet'
    import { date as i18nDate } from 'svelte-i18n'
    import type { Readable } from 'svelte/store'
    import { get } from 'svelte/store'

    export let locale
    export let account: Readable<WalletAccount>

    let addresses: Address[]
    $: addresses = $account?.addresses ?? [] // TODO: sort by date when exposed

    const date = get(i18nDate)(new Date(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }) // TODO: use real date when exposed
</script>

<style>
    .history {
        max-height: 30vh;
    }
</style>

<div class="mb-5">
    <Text type="h4">{locale('popups.addressHistory.title', { values: { name: $account.alias } })}</Text>
</div>
<div class="history scrollable-y flex flex-row flex-wrap space-y-7">
    {#each addresses as _addr}
        <div class="flex flex-row flex-wrap space-y-1">
            <Text type="p" secondary>{date}</Text>
            <Text type="pre">{_addr.address}</Text>
            <Text type="p">
                {locale('popups.addressHistory.currentBalance', { values: { balance: formatUnit(_addr.balance) } })}
            </Text>
        </div>
    {/each}
</div>
