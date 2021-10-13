<script lang="typescript">
    import { Input, Text, Icon } from 'shared/components'
    import { getTrimmedLength } from 'shared/lib/helpers'
    import { walletRoute } from 'shared/lib/router'
    import { WalletRoutes } from 'shared/lib/typings/routes'
    import { wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher } from 'svelte';

    export let locale: Locale

    export let error = ''

    export let onCreate = (..._: any[]): void => {}

    const { accounts } = $wallet

    export let alias
    export let balance
    export let balanceEquiv
    export let inputHandler

    const dispatch = createEventDispatcher();
    function handleSubmit() {
      dispatch('handleInputSubmit')
    }

    let accountAlias = alias
    let isBusy = false

    // This looks odd but sets a reactive dependency on accountAlias, so when it changes the error will clear
    $: accountAlias, (error = '')

    const handleCancelClick = () => {
        error = ''
        walletRoute.set(WalletRoutes.Init)
    }

    const handleColorSelection = (color) => {
        selectedColor = color
    }

    const handlePatternSelection = (pattern) => {
        selectedPattern = pattern
    }

    const walletColors = [
        'blue-400',
        'lightblue-500',
        'turquoise-500',
        'green-100',
        'yellow-500',
        'orange-500',
        'red-500',
        'purple-500',
    ]

    const walletPatterns = ['', 'circles', 'clouds', 'clover', 'organic', 'rain', 'shapes', 'wind']

    $: selectedColor = walletColors[0]

    $: selectedPattern = 'circles'
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
            class="w-full h-32 bg-{selectedColor} rounded-lg mb-2 bg-contain bg-right-top bg-no-repeat flex flex-col justify-between p-4"
            style="background-image: url({`assets/patterns/${selectedPattern}.svg`})">
            <Text smaller>{alias || locale('general.createAccount')}</Text>
            <div class="w-full flex justify-between flex-row">
                <Text smaller>{balance || '0 Mi'}</Text>
                <Text smaller>{balanceEquiv || '$ 0000'}</Text>
            </div>
        </div>
        <Input
            {error}
            bind:value={accountAlias}
            placeholder={locale('general.accountName')}
            autofocus
            submitHandler={handleSubmit}
            disabled={isBusy} />
        <div>
            <Text type="h5">{locale('general.walletColor')}</Text>
            <div class="w-full flex justify-between flex-row my-2">
                {#each walletColors as color}
                    <div
                        class="bg-{color} h-5 w-5 rounded flex justify-center items-center"
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
            <div class="w-full flex flex-row flex-wrap justify-between my-2">
                {#each walletPatterns as pattern}
                    <div
                        class="h-12 w-14 bg-{selectedPattern === pattern ? selectedColor : ''} rounded mb-2"
                        on:click={() => handlePatternSelection(pattern)}>
                        <img
                            class="object-cover"
                            width="100%"
                            height="100%"
                            src={`assets/patterns/${pattern}.svg`}
                            alt="" />
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
