<script lang="typescript">
    import { Input, Text, } from 'shared/components'
    import { Locale } from 'shared/lib/typings/i18n'
    import { createEventDispatcher, onMount } from 'svelte'
    import { ColorPicker } from '.'
    import { PatternPicker } from '.'


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
        selectedColor = color.detail
    }

    const handlePatternSelection = (pattern) => {
        selectedPattern = pattern.detail
    }

    const dispatch = createEventDispatcher()

    function handleSubmit() {
        dispatch('handleInputSubmit')
    }
</script>

<style lang="scss">
    .box {
        background-color: var(--color);
    }
</style>

<div>
    <div class="flex flex-row mb-2">
        <Text type="h5">{alias ? locale('general.manageAccount') : locale('general.createAccount')}</Text>
    </div>
    <div class="w-full h-full flex flex-col justify-between">
        <div
            class="w-full h-32 bg-{selectedColor}-500 rounded-lg mb-2 bg-contain bg-right-top bg-no-repeat flex flex-col justify-between p-6"
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
            <div class="w-full flex justify-between flex-row mb-2">
                <ColorPicker on:handleColorSelection={handleColorSelection} {walletColors} bind:selectedColor /> 
            </div>
        </div>
        <div>
            <Text type="h5">{locale('gneral.walletPattern')}</Text>
            <div class="w-full flex flex-row flex-wrap my-2 justify-evenly">
                <PatternPicker on:handlePatternSelection={handlePatternSelection} walletPatterns={walletPatterns} bind:selectedPattern {selectedColor} />
            </div>
        </div>
    </div>
</div>
