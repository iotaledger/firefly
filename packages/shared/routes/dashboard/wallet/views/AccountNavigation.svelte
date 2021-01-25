<script lang="typescript">
    import { getInitials } from 'shared/lib/helpers'
    import { Text, Button } from 'shared/components'

    export let locale
    export let mobile
    export let account
    export let accounts
    export let _previous
    export let selectAccount
</script>

<div class="relative flex flex-row justify-center items-center w-full py-5">
    <div class="absolute left-0">
        <Button secondary small icon="arrow-left" iconReverse onClick={() => _previous(true)}>{locale('actions.back')}</Button>
    </div>
    <Text type="h3" classes="text-center">{account.name}</Text>
    <div class="absolute right-0 flex flex-row space-x-4 account-switch">
        {#each accounts as acc}
            <button
                on:click={() => selectAccount(acc.index)}
                class="w-10 h-10 rounded-xl p-2 text-14 leading-140 font-bold text-center
                {account.index === acc.index ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 text-gray-500'} 
                hover:bg-{acc.color}-500 hover:text-white">{getInitials(acc.name, 2)}
            </button>
        {/each}
    </div>
</div>
