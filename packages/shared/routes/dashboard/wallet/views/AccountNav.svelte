<script lang="typescript">
    import { createEventDispatcher } from 'svelte'
    import { getInitials } from 'shared/lib/helpers'
    import { Text, Button } from 'shared/components'

    export let locale
    export let accounts

    const dispatch = createEventDispatcher()

    $: activeAccount = accounts.find((acc) => acc.active)

    function handleAccountClick(accountId) {
        dispatch('next', { accountId })
    }
    function handleBackClick() {
        dispatch('previous', { exit: true })
    }
</script>

<div class="relative flex flex-row justify-center items-center w-full py-5">
    <div class="absolute left-0">
        <Button secondary small icon="arrow-left" iconReverse onClick={handleBackClick}>{locale('actions.back')}</Button>
    </div>
    <Text type="h3" classes="text-center">{activeAccount.name}</Text>
    <div class="absolute right-0 flex flex-row space-x-4 account-switch">
        {#each accounts as acc}
            <button
                on:click={() => handleAccountClick(acc.id)}
                class="w-10 h-10 rounded-xl p-2 text-14 leading-140 font-bold text-center
                {activeAccount.id === acc.id ? `bg-${acc.color}-500 text-white` : 'bg-gray-200 text-gray-500'} 
                hover:bg-{acc.color}-500 hover:text-white">{getInitials(acc.name, 2)}
            </button>
        {/each}
    </div>
</div>
