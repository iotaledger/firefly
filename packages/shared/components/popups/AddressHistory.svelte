<script>
    import { getContext } from 'svelte'
    import { Text } from 'shared/components'

    export let locale
    const account = getContext('selectedAccount')

    const dummyAddressHistory = [
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
        {
            date: '20 June 2020, 14:03',
            address: 'iot1q9f0mlq8yxpx2nck8a0slxnzr4ef2ek8f5gqxlzd0wasgp73utryjtzcp98',
            balance: '0 Mi',
        },
    ]
</script>

<style>
    .history {
        max-height: 30vh;
    }
</style>

<div class="mb-5">
    <Text type="h4">{locale('popups.address_history.title', { values: { name: $account.alias } })}</Text>
</div>
<div class="history overflow-y-auto">
    {#each dummyAddressHistory as address}
        <div class="mb-7 flex flex-row flex-wrap">
            <Text type="p" secondary>{address.date}</Text>
            <Text type="pre">{address.address}</Text>
            <Text type="p">{address.balance}</Text>
        </div>
    {/each}
</div>
