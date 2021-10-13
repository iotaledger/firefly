<script lang="typescript">
    import { Input, Text, Icon, AccountTile } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher, onMount } from 'svelte'

    export let locale: Locale

    export let error = ''

    onMount(() => {
        selectedColor = createWallet ? walletColors[0] : selectedColor
        selectedPattern = createWallet ? walletPatterns[0] : selectedPattern
    })

    const walletColors = ['blue', 'lightblue', 'turquoise', 'green', 'yellow', 'orange', 'red', 'purple']

    const walletPatterns = ['', 'circles', 'clouds', 'clover', 'organic', 'rain', 'shapes', 'wind']

    export let alias
    export let balance
    export let balanceEquiv
    export let selectedColor
    export let selectedPattern
    export let createWallet = false

    const isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    // $: accountAlias, (error = '')

    const handleColorSelection = (color) => {
        selectedColor = color
    }

    const handlePatternSelection = (pattern) => {
        selectedPattern = pattern
    }

    const dispatch = createEventDispatcher()

    function handleSubmit() {
        dispatch('handleInputSubmit')
    }
</script>

<style>
    .box {
        background-color: var(--color);
    }
</style>

<div>
    <div class="flex flex-row mb-6">
        <Text type="h5">{alias ? locale('general.manageAccount') : locale('general.createAccount')}</Text>
    </div>
    <div class="w-full h-full flex flex-col justify-between">
        <div
            class="w-full h-32 bg-{selectedColor}-500 rounded-lg mb-2 bg-contain bg-right-top bg-no-repeat flex flex-col justify-between p-4"
            style="background-image: url({`assets/patterns/${selectedPattern}.svg`})">
            <Text smaller>{alias || locale('general.createAccount')}</Text>
            <div class="w-full flex justify-between flex-row">
                <Text smaller>{balance || '0 Mi'}</Text>
                <Text smaller>{balanceEquiv || '$ 0000'}</Text>
            </div>
        </div>
        <Input
            {error}
            bind:value={alias}
            placeholder={locale('general.accountName')}
            autofocus
            submitHandler={handleSubmit}
            disabled={isBusy} />
        <div>
            <Text type="h5">{locale('general.walletColor')}</Text>
            <div class="w-full flex justify-between flex-row my-2">
                {#each walletColors as color}
                    <div
                        class="bg-{color}-500 h-5 w-5 rounded flex justify-center items-center"
                        on:click={() => handleColorSelection(color)}>
                        {#if selectedColor === color}
                            <Icon icon="success-check" classes="h-6 w-4 text-white" />
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
        <div>
            <Text type="h5">{locale('general.walletPattern')}</Text>
            <div class="w-full flex flex-row flex-wrap my-2 justify-evenly">
                {#each walletPatterns as pattern}
                    <div
                        class="h-12 w-14 bg-{selectedPattern === pattern ? selectedColor : ''}-500 rounded mb-2 m- flex justify-center items-center"
                        on:click={() => handlePatternSelection(pattern)}>
                        <img
                            class="object-cover"
                            width="100%"
                            height="100%"
                            src={`assets/patterns/${pattern}.svg`}
                            alt="" />
                        {#if selectedPattern === pattern}
                            <div class="bg-green-100 h-5 w-5 rounded-2xl flex justify-center items-center z-10 absolute">
                              <Icon icon="success-check" classes="h-5  w-5 text-white" />
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
